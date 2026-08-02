import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';

import { db } from './src/server/db.js';
import { evaluateMCQ, evaluateSQLQuery, evaluateCodeSubmission } from './src/server/executor.js';
import { setupSocketHandlers } from './src/server/sockets.js';
import { User } from './src/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hireprep-jwt-secret-key-change-in-production';
const PORT = 3000;

interface AuthRequest extends Request {
  user?: User;
}

// Authentication middleware
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.getUserById(decoded.id);
    if (!user || user.status === 'disabled') {
      return res.status(403).json({ error: 'User account inactive or not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Admin authorized middleware
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*' },
  });

  setupSocketHandlers(io);

  // --- API ROUTES ---

  // 1. Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmailOrUsername(email) || db.getUserByEmailOrUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Email or Username already exists' });
    }

    const user = db.createUser(
      {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        role: 'user',
        status: 'active',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`,
      },
      password
    );

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token, user });
  });

  // 2. Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { loginTerm, password } = req.body;

    if (!loginTerm || !password) {
      return res.status(400).json({ error: 'Username/Email and Password are required' });
    }

    const user = db.getUserByEmailOrUsername(loginTerm);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ error: 'Your account has been disabled by an administrator' });
    }

    const isValid = db.verifyPassword(user.id, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token, user });
  });

  // 3. Auth: Get Current User
  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
    return res.json({ user: req.user });
  });

  // 4. Profile Update
  app.put('/api/user/profile', authenticateToken, (req: AuthRequest, res: Response) => {
    const { name, username, avatar, password } = req.body;
    const userId = req.user!.id;

    if (username && username.toLowerCase() !== req.user!.username.toLowerCase()) {
      const existing = db.getUserByEmailOrUsername(username);
      if (existing && existing.id !== userId) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const updated = db.updateUser(
      userId,
      {
        ...(name ? { name } : {}),
        ...(username ? { username: username.toLowerCase() } : {}),
        ...(avatar ? { avatar } : {}),
      },
      password
    );

    return res.json({ user: updated });
  });

  // 5. User Progress Stats
  app.get('/api/user/progress', authenticateToken, (req: AuthRequest, res: Response) => {
    const progress = db.getUserProgress(req.user!.id);
    return res.json(progress);
  });

  // 6. Categories
  app.get('/api/categories', (req: Request, res: Response) => {
    const categories = db.getCategories();
    return res.json(categories);
  });

  app.post('/api/categories', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and Description are required' });
    }
    const cat = db.addCategory(name.trim(), description.trim());
    return res.json(cat);
  });

  // 7. Questions List
  app.get('/api/questions', (req: Request, res: Response) => {
    const { categoryId, type, search, userId } = req.query;
    const questions = db.getQuestions({
      categoryId: categoryId as string,
      type: type as string,
      search: search as string,
      userId: userId as string,
    });
    return res.json(questions);
  });

  // 8. Question Detail
  app.get('/api/questions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.query;
    const question = db.getQuestionById(id, userId as string);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json(question);
  });

  // 9. Admin Question Operations
  app.post('/api/questions', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { categoryId, categoryName, type, title, description, mcqData, codingData, sqlData } = req.body;
    if (!categoryId || !categoryName || !type || !title || !description) {
      return res.status(400).json({ error: 'Missing required question fields' });
    }

    const question = db.createQuestion({
      categoryId,
      categoryName,
      type,
      title,
      description,
      mcqData,
      codingData,
      sqlData,
    });

    return res.json(question);
  });

  app.put('/api/questions/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = db.updateQuestion(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    return res.json(updated);
  });

  app.delete('/api/questions/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const success = db.deleteQuestion(id);
    if (!success) return res.status(404).json({ error: 'Question not found' });
    return res.json({ success: true });
  });

  // 10. Submissions (Evaluate & Record)
  app.post('/api/submissions', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { questionId, answerOrCode, language, selectedIndex } = req.body;
    const user = req.user!;

    const question = db.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    let status: any = 'incorrect';
    let score = 0;
    let feedback = '';
    let testCaseResults: any[] | undefined = undefined;
    let sqlResult: any | undefined = undefined;

    if (question.type === 'mcq') {
      const evalRes = await evaluateMCQ(question, selectedIndex);
      status = evalRes.status;
      score = evalRes.score;
      feedback = evalRes.explanation;
    } else if (question.type === 'coding') {
      const evalRes = await evaluateCodeSubmission(question, answerOrCode, language || 'python');
      status = evalRes.status;
      score = evalRes.score;
      feedback = evalRes.feedback;
      testCaseResults = evalRes.testCaseResults;
    }

    const submission = db.addSubmission({
      userId: user.id,
      username: user.username,
      questionId: question.id,
      questionTitle: question.title,
      categoryName: question.categoryName,
      type: question.type,
      answerOrCode: String(answerOrCode || selectedIndex),
      language,
      status,
      score,
      feedback,
      testCaseResults,
      sqlResult,
    });

    return res.json(submission);
  });

  // 11. Study Rooms
  app.post('/api/rooms', authenticateToken, (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = db.createStudyRoom(name.trim(), description?.trim(), req.user!);
    return res.json(room);
  });

  app.get('/api/rooms', authenticateToken, (req: Request, res: Response) => {
    const rooms = db.getAllStudyRooms();
    return res.json(rooms);
  });

  app.get('/api/rooms/code/:code', authenticateToken, (req: Request, res: Response) => {
    const room = db.getStudyRoomByCode(req.params.code);
    if (!room) return res.status(404).json({ error: 'Study room not found' });
    return res.json(room);
  });

  app.get('/api/rooms/:id', authenticateToken, (req: Request, res: Response) => {
    const room = db.getStudyRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Study room not found' });
    const members = db.getRoomMembers(room.id);
    return res.json({ room, members });
  });

  // 12. Admin Panel Endpoints
  app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const stats = db.getAdminStats();
    return res.json(stats);
  });

  app.get('/api/admin/users', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const users = db.getAllUsers();
    return res.json(users);
  });

  app.put('/api/admin/users/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = db.updateUser(id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    return res.json(updated);
  });

  app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const success = db.deleteUser(id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true });
  });

  app.get('/api/admin/submissions', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const submissions = db.getAllSubmissions();
    return res.json(submissions);
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`HirePrep Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
