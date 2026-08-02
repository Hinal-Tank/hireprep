import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.js';
import { useSocket } from '../context/SocketContext.js';
import {
  Users,
  LogOut,
  Copy,
  Check,
  Send,
  HelpCircle,
  Code2,
  Database,
  Pencil,
  Square,
  Circle as CircleIcon,
  Eraser,
  Trash2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Trophy,
  MessageSquare,
  Layers,
  Sparkles,
  Play,
} from 'lucide-react';
import {
  StudyRoom,
  RoomMember,
  ChatMessage,
  Question,
  WhiteboardElement,
} from '../types.js';

interface StudyRoomWorkspacePageProps {
  roomId: string;
  onLeaveRoom: () => void;
}

export const StudyRoomWorkspacePage: React.FC<StudyRoomWorkspacePageProps> = ({
  roomId,
  onLeaveRoom,
}) => {
  const { user, token } = useAuth();
  const {
    socket,
    joinRoom,
    sendChatMessage,
    selectRoomQuestion,
    updateStatus,
    drawWhiteboard,
    clearWhiteboard,
    sendSubmissionScore,
  } = useSocket();

  const [roomData, setRoomData] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'question' | 'whiteboard' | 'call'>('question');

  // Sidebar Tab: 'chat' | 'members' | 'scoreboard'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'members' | 'scoreboard'>('chat');
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Question Selector & Practice State inside Study Room
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Whiteboard State & Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pencil' | 'line' | 'rectangle' | 'circle' | 'eraser'>('pencil');
  const [color, setColor] = useState('#38bdf8');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingElements, setDrawingElements] = useState<WhiteboardElement[]>([]);
  const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null);

  // Voice / Video Call State
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  // 1. Initial Room Load & WebSockets Subscriptions
  useEffect(() => {
    fetchRoomDetails();
    fetchQuestions();
    joinRoom(roomId);

    if (!socket) return;

    socket.on('room_members_update', (updatedMembers: RoomMember[]) => {
      setMembers(updatedMembers);
    });

    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('chat_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('room_question_changed', ({ question }: { question: Question }) => {
      setActiveQuestion(question);
      setMcqSelected(null);
      setCodeAnswer(question.codingData?.starterCode?.python || (question.type === 'sql' ? '-- Write your SQL query below:\n' : ''));
      setSubmissionFeedback(null);
    });

    socket.on('whiteboard_state', (elements: WhiteboardElement[]) => {
      setDrawingElements(elements);
    });

    socket.on('whiteboard_draw', (element: WhiteboardElement) => {
      setDrawingElements((prev) => [...prev, element]);
    });

    socket.on('whiteboard_clear', () => {
      setDrawingElements([]);
    });

    socket.on('scoreboard_update', (updatedMembers: RoomMember[]) => {
      setMembers(updatedMembers);
    });

    return () => {
      socket.off('room_members_update');
      socket.off('chat_history');
      socket.off('chat_message');
      socket.off('room_question_changed');
      socket.off('whiteboard_state');
      socket.off('whiteboard_draw');
      socket.off('whiteboard_clear');
      socket.off('scoreboard_update');
    };
  }, [roomId, socket]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoomDetails = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoomData(data.room);
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        if (data.length > 0 && !activeQuestion) {
          setActiveQuestion(data[0]);
          setCodeAnswer(data[0].codingData?.starterCode?.python || (data[0].type === 'sql' ? '-- Write your SQL query below:\n' : ''));
        }
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  };

  const handleSelectQuestion = (q: Question) => {
    setActiveQuestion(q);
    setMcqSelected(null);
    setCodeAnswer(q.codingData?.starterCode?.python || (q.type === 'sql' ? '-- Write your SQL query below:\n' : ''));
    setSubmissionFeedback(null);
    selectRoomQuestion(roomId, q.id, q);
    updateStatus(roomId, `Solving ${q.title}`, 'Solving');
  };

  // 2. Chat Send Handler
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(roomId, chatInput.trim());
    setChatInput('');
  };

  // 3. Question Submission inside Study Room
  const handleRoomSubmission = async () => {
    if (!activeQuestion || !token) return;

    updateStatus(roomId, `Submitting ${activeQuestion.title}`, 'Submitted');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          answerOrCode: activeQuestion.type === 'mcq' ? mcqSelected : codeAnswer,
          selectedIndex: mcqSelected,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const isCorrect = data.status === 'correct' || data.status === 'accepted';
        setSubmissionFeedback(
          isCorrect
            ? `Correct! Earned +${data.score} room points.`
            : `Submission outcome: ${data.status}.`
        );

        if (isCorrect) {
          sendSubmissionScore(roomId, data.score);
          updateStatus(roomId, `Solved ${activeQuestion.title}`, 'Correct');
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } else {
          updateStatus(roomId, `Attempted ${activeQuestion.title}`, 'Incorrect');
        }
      }
    } catch (err) {
      console.error('Error submitting in study room:', err);
    }
  };

  // 4. Collaborative Whiteboard Rendering & Canvas Handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render elements
    const elementsToRender = currentElement ? [...drawingElements, currentElement] : drawingElements;

    elementsToRender.forEach((el) => {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'pencil' && el.points && el.points.length >= 4) {
        ctx.beginPath();
        ctx.moveTo(el.points[0], el.points[1]);
        for (let i = 2; i < el.points.length; i += 2) {
          ctx.lineTo(el.points[i], el.points[i + 1]);
        }
        ctx.stroke();
      } else if (el.type === 'line' && el.points && el.points.length >= 4) {
        ctx.beginPath();
        ctx.moveTo(el.points[0], el.points[1]);
        ctx.lineTo(el.points[2], el.points[3]);
        ctx.stroke();
      } else if (el.type === 'rectangle' && el.x !== undefined && el.y !== undefined) {
        ctx.strokeRect(el.x, el.y, el.width || 0, el.height || 0);
      } else if (el.type === 'circle' && el.x !== undefined && el.y !== undefined) {
        ctx.beginPath();
        const rx = (el.width || 0) / 2;
        const ry = (el.height || 0) / 2;
        ctx.ellipse(el.x + rx, el.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  }, [drawingElements, currentElement, activeWorkspaceTab]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const drawColor = tool === 'eraser' ? '#020617' : color;
    const drawWidth = tool === 'eraser' ? strokeWidth * 4 : strokeWidth;

    const newEl: WhiteboardElement = {
      id: Math.random().toString(),
      type: tool === 'eraser' ? 'pencil' : tool,
      points: [x, y],
      x,
      y,
      width: 0,
      height: 0,
      color: drawColor,
      strokeWidth: drawWidth,
    };
    setCurrentElement(newEl);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), x, y],
      });
    } else if (tool === 'line') {
      const startX = currentElement.points ? currentElement.points[0] : x;
      const startY = currentElement.points ? currentElement.points[1] : y;
      setCurrentElement({
        ...currentElement,
        points: [startX, startY, x, y],
      });
    } else if (tool === 'rectangle' || tool === 'circle') {
      setCurrentElement({
        ...currentElement,
        width: x - (currentElement.x || 0),
        height: y - (currentElement.y || 0),
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;
    setIsDrawing(false);
    drawWhiteboard(roomId, currentElement);
    setDrawingElements((prev) => [...prev, currentElement]);
    setCurrentElement(null);
  };

  // 5. Voice/Video Media Toggle Handler
  const toggleMediaStream = async (type: 'mic' | 'camera') => {
    if (type === 'mic') {
      setMicOn(!micOn);
    } else {
      if (!cameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCameraOn(true);
        } catch (e) {
          console.error('Camera access error:', e);
          setCameraOn(false);
        }
      } else {
        if (localStream) {
          localStream.getTracks().forEach((t) => t.stop());
        }
        setLocalStream(null);
        setCameraOn(false);
      }
    }
  };

  const copyRoomCode = () => {
    if (roomData?.roomId) {
      navigator.clipboard.writeText(roomData.roomId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 py-4 space-y-4 font-sans">
      {/* Top Workspace Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-6 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            HP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">{roomData?.name || 'Study Room Workspace'}</h1>
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-indigo-700 border border-slate-200">
                ID: {roomData?.roomId}
              </span>
              <button
                onClick={copyRoomCode}
                className="p-1 text-slate-400 hover:text-slate-700 transition"
                title="Copy Room ID"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">Host: {roomData?.hostName}</p>
          </div>
        </div>

        {/* Workspace Mode Tabs */}
        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveWorkspaceTab('question')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeWorkspaceTab === 'question'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Question Solver</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('whiteboard')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeWorkspaceTab === 'whiteboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('call')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeWorkspaceTab === 'call'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Voice / Call</span>
          </button>
        </div>

        {/* Members Count & Leave Room */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{members.length} Member(s)</span>
          </div>

          <button
            onClick={onLeaveRoom}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Room</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Grid: Main Content + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Side: Active Workspace Tab */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          {/* TAB 1: QUESTION SOLVER */}
          {activeWorkspaceTab === 'question' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Question Selector Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Active Room Question:</span>
                  <select
                    value={activeQuestion?.id || ''}
                    onChange={(e) => {
                      const found = questions.find((q) => q.id === e.target.value);
                      if (found) handleSelectQuestion(found);
                    }}
                    className="bg-slate-50 border border-slate-200 text-indigo-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer max-w-xs"
                  >
                    {questions.map((q) => (
                      <option key={q.id} value={q.id} className="bg-white text-slate-800">
                        [{q.categoryName}] {q.title} ({q.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {activeQuestion && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                        {activeQuestion.categoryName} • {activeQuestion.type.toUpperCase()}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">{activeQuestion.title}</h2>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{activeQuestion.description}</p>
                    </div>

                    {/* MCQ Options */}
                    {activeQuestion.type === 'mcq' && (
                      <div className="space-y-2 pt-2">
                        {activeQuestion.mcqData?.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setMcqSelected(idx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition ${
                              mcqSelected === idx
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Coding / SQL Editor */}
                    {(activeQuestion.type === 'coding' || activeQuestion.type === 'sql') && (
                      <div className="h-64 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs">
                        <textarea
                          value={codeAnswer}
                          onChange={(e) => setCodeAnswer(e.target.value)}
                          placeholder="// Write collaborative code solution here..."
                          className="w-full h-full bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button & Feedback */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {submissionFeedback && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-indigo-700 font-semibold">
                    {submissionFeedback}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleRoomSubmission}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Submit & Update Room Score</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATIVE WHITEBOARD */}
          {activeWorkspaceTab === 'whiteboard' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Whiteboard Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTool('pencil')}
                    className={`p-2 rounded-xl transition ${tool === 'pencil' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Pencil"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('line')}
                    className={`p-2 rounded-xl transition ${tool === 'line' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Line"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('rectangle')}
                    className={`p-2 rounded-xl transition ${tool === 'rectangle' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Rectangle"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('circle')}
                    className={`p-2 rounded-xl transition ${tool === 'circle' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Circle"
                  >
                    <CircleIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-xl transition ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    title="Eraser"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>

                {/* Color Palette */}
                <div className="flex items-center space-x-2">
                  {['#4f46e5', '#7c3aed', '#059669', '#e11d48', '#d97706', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-full border border-slate-300 transition ${color === c ? 'ring-2 ring-slate-900 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => clearWhiteboard(roomId)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Canvas</span>
                  </button>
                </div>
              </div>

              {/* Whiteboard Canvas */}
              <div className="relative flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden min-h-[480px]">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={480}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="w-full h-full cursor-crosshair block"
                />
              </div>
            </div>
          )}

          {/* TAB 3: VOICE / VIDEO CALL */}
          {activeWorkspaceTab === 'call' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Video className="w-5 h-5 text-indigo-600" />
                    <span>WebRTC Study Room Video & Voice Stream</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Local Video Stream Container */}
                  <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                    {cameraOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <img
                          src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                          alt="Avatar"
                          className="w-16 h-16 rounded-full mx-auto ring-2 ring-indigo-500/30"
                        />
                        <p className="text-xs font-bold text-slate-100">{user?.name} (You)</p>
                        <p className="text-[10px] text-slate-400">Camera turned off</p>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-slate-200 font-bold border border-slate-800">
                      You {micOn ? '🎙️ (Mic Active)' : '🔇 (Muted)'}
                    </div>
                  </div>

                  {/* Room Member Streams Simulation */}
                  {members
                    .filter((m) => m.userId !== user?.id)
                    .map((mem) => (
                      <div key={mem.id} className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <img
                            src={mem.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${mem.username}`}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full mx-auto ring-2 ring-cyan-500/30"
                          />
                          <p className="text-xs font-bold text-slate-100">{mem.username}</p>
                          <p className="text-[10px] text-emerald-400 font-semibold">🟢 In Room Call</p>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-slate-200 font-bold border border-slate-800">
                          {mem.username}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  onClick={() => toggleMediaStream('mic')}
                  className={`p-3.5 rounded-xl transition ${
                    micOn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-rose-600 border border-slate-200'
                  }`}
                  title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => toggleMediaStream('camera')}
                  className={`p-3.5 rounded-xl transition ${
                    cameraOn ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-rose-600 border border-slate-200'
                  }`}
                  title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Chat, Members, Scoreboard */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between max-h-[720px]">
          {/* Sidebar Tab Toggle */}
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 mb-4">
            <button
              onClick={() => setActiveSidebarTab('chat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeSidebarTab === 'chat' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('members')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeSidebarTab === 'members' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Members ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('scoreboard')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeSidebarTab === 'scoreboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Scoreboard</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeSidebarTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs" id="chat-messages-container">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.username}</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-slate-200 flex items-center space-x-2">
                <input
                  id="input-chat-message"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  type="submit"
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: MEMBERS LIST */}
          {activeSidebarTab === 'members' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={mem.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${mem.username}`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-slate-200 bg-white"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          mem.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 font-bold text-slate-800">
                        <span>{mem.username}</span>
                        {mem.isHost && <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded">Host</span>}
                      </div>
                      <p className="text-[10px] text-slate-500">{mem.currentActivity || 'Online'}</p>
                    </div>
                  </div>

                  <span className="font-bold text-amber-700 text-xs">{mem.score} pts</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PRIVATE ROOM SCOREBOARD */}
          {activeSidebarTab === 'scoreboard' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2 block flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Room Standings</span>
                </span>

                <div className="space-y-2">
                  {members
                    .sort((a, b) => b.score - a.score)
                    .map((mem, idx) => (
                      <div
                        key={mem.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              idx === 0
                                ? 'bg-amber-400 text-slate-950'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-800">{mem.username}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-indigo-700">{mem.score} pts</span>
                          <p className="text-[9px] text-slate-500">{mem.questionsSolved} solved</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
