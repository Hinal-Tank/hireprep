export type Role = 'admin' | 'user';
export type UserStatus = 'active' | 'disabled';
export type QuestionType = 'mcq' | 'coding' | 'sql' | 'hr';
export type SubmissionStatus = 'correct' | 'incorrect' | 'accepted' | 'rejected' | 'error' | 'pending';
export type MemberSolvingStatus = 'Not Started' | 'Solving' | 'Submitted' | 'Correct' | 'Incorrect';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestionData {
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface TestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingQuestionData {
  starterCode: Record<string, string>; // language -> code snippet
  testCases: TestCase[];
  supportedLanguages: string[];
  inputDescription?: string;
  outputDescription?: string;
  constraints?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
}

export interface SQLQuestionData {
  schema: string; // DDL commands to set up tables
  sampleData: string; // INSERT statements or description
  sampleTables?: Array<{ name: string; columns: string[]; rows: any[][] }>;
  expectedResult: any[]; // Array of result objects
  correctQuery: string;
}

export interface HRQuestionData {
  sampleAnswer: string;
  rating?: string;
  whyThisWorks?: string;
  improveItBy?: string;
  avoid?: string;
  importantNotes?: string;
  interviewTips?: string;
  category?: string;
}

export interface Question {
  id: string;
  categoryId: string;
  categoryName: string;
  type: QuestionType;
  title: string;
  description: string;
  createdAt: string;
  mcqData?: MCQQuestionData;
  codingData?: CodingQuestionData;
  sqlData?: SQLQuestionData;
  hrData?: HRQuestionData;
  solved?: boolean;
  userStatus?: SubmissionStatus;
}

export interface Submission {
  id: string;
  userId: string;
  username: string;
  questionId: string;
  questionTitle: string;
  categoryName: string;
  type: QuestionType;
  answerOrCode: string; // answer choice index or code snippet or SQL string
  language?: string;
  status: SubmissionStatus;
  score: number;
  submittedAt: string;
  feedback?: string;
  testCaseResults?: Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }>;
  sqlResult?: {
    columns: string[];
    rows: any[][];
  };
}

export interface StudyRoom {
  id: string;
  roomId: string; // e.g. HP-A7K29
  name: string;
  description?: string;
  hostId: string;
  hostName: string;
  createdAt: string;
  activeQuestionId?: string;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  questionsSolved: number;
  correctAnswers: number;
  isOnline: boolean;
  currentActivity?: string; // e.g., "Solving Python Question"
  solvingStatus?: MemberSolvingStatus;
  joinedAt: string;
  isHost?: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  createdAt: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'pencil' | 'line' | 'rectangle' | 'circle' | 'text';
  points?: number[]; // for pencil: [x1, y1, x2, y2, ...]
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

export interface RoomActivity {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  questionId?: string;
  questionTitle?: string;
  status: string;
  created_at: string;
}

export interface UserProgressStats {
  totalSolved: number;
  totalCorrect: number;
  accuracy: number;
  mcqsSolved: number;
  codingSolved: number;
  sqlSolved: number;
  studyRoomsJoined: number;
  totalScore: number;
  categoryBreakdown: Record<string, { solved: number; total: number; correct: number }>;
  solvedQuestionIds?: string[];
  recentSubmissions: Submission[];
}

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalSubmissions: number;
  activeStudyRooms: number;
  questionsSolvedToday: number;
}
