import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  sendChatMessage: (roomId: string, message: string) => void;
  selectRoomQuestion: (roomId: string, questionId: string, question: any) => void;
  updateStatus: (roomId: string, activity: string, solvingStatus?: string) => void;
  drawWhiteboard: (roomId: string, element: any) => void;
  clearWhiteboard: (roomId: string) => void;
  requestWhiteboardState: (roomId: string) => void;
  broadcastWhiteboardSync: (roomId: string, elements: any[]) => void;
  notifyWhiteboardActive: (roomId: string) => void;
  broadcastQuestionAttempt: (
    roomId: string,
    questionId: string,
    selectedIndex?: number | null,
    isCorrect?: boolean,
    score?: number
  ) => void;
  hostForceRevealAnswers: (roomId: string, questionId: string) => void;
  sendSubmissionScore: (roomId: string, points: number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const currentRoomIdRef = React.useRef<string | null>(null);
  const userRef = React.useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
      // Auto rejoin room on reconnect if previously in a room
      if (currentRoomIdRef.current && userRef.current) {
        socketInstance.emit('join_room', {
          roomId: currentRoomIdRef.current,
          user: { id: userRef.current.id, username: userRef.current.username, avatar: userRef.current.avatar },
        });
      }
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string) => {
    currentRoomIdRef.current = roomId;
    if (socket && user) {
      socket.emit('join_room', { roomId, user: { id: user.id, username: user.username, avatar: user.avatar } });
    }
  };

  const sendChatMessage = (roomId: string, message: string) => {
    if (socket && user) {
      socket.emit('send_chat_message', {
        roomId,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        message,
      });
    }
  };

  const selectRoomQuestion = (roomId: string, questionId: string, question: any) => {
    if (socket) {
      socket.emit('select_room_question', { roomId, questionId, question });
    }
  };

  const updateStatus = (roomId: string, activity: string, solvingStatus?: string) => {
    if (socket && user) {
      socket.emit('update_member_status', { roomId, userId: user.id, activity, solvingStatus });
    }
  };

  const drawWhiteboard = (roomId: string, element: any) => {
    if (socket) {
      socket.emit('whiteboard_draw', { roomId, element, user: user ? { username: user.username } : undefined });
    }
  };

  const clearWhiteboard = (roomId: string) => {
    if (socket) {
      socket.emit('whiteboard_clear', { roomId });
    }
  };

  const requestWhiteboardState = (roomId: string) => {
    if (socket) {
      socket.emit('request_whiteboard_state', { roomId });
    }
  };

  const broadcastWhiteboardSync = (roomId: string, elements: any[]) => {
    if (socket) {
      socket.emit('whiteboard_replace', { roomId, elements, username: user?.username });
    }
  };

  const notifyWhiteboardActive = (roomId: string) => {
    if (socket && user) {
      socket.emit('whiteboard_active_user', { roomId, username: user.username });
    }
  };

  const broadcastQuestionAttempt = (
    roomId: string,
    questionId: string,
    selectedIndex?: number | null,
    isCorrect?: boolean,
    score?: number
  ) => {
    if (socket && user) {
      socket.emit('member_question_attempt', {
        roomId,
        questionId,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        selectedIndex,
        isCorrect,
        score,
      });
    }
  };

  const hostForceRevealAnswers = (roomId: string, questionId: string) => {
    if (socket) {
      socket.emit('host_force_reveal_answers', { roomId, questionId });
    }
  };

  const sendSubmissionScore = (roomId: string, points: number) => {
    if (socket && user) {
      socket.emit('room_submission', { roomId, userId: user.id, pointsEarned: points });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        sendChatMessage,
        selectRoomQuestion,
        updateStatus,
        drawWhiteboard,
        clearWhiteboard,
        requestWhiteboardState,
        broadcastWhiteboardSync,
        notifyWhiteboardActive,
        broadcastQuestionAttempt,
        hostForceRevealAnswers,
        sendSubmissionScore,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
