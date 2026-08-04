import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from './db.js';

interface WhiteboardStateMap {
  [roomId: string]: any[];
}

const whiteboardStores: WhiteboardStateMap = {};

interface QuestionResponseStore {
  [roomId: string]: {
    [questionId: string]: {
      [userId: string]: {
        userId: string;
        username: string;
        avatar?: string;
        selectedIndex: number;
        isCorrect: boolean;
        score: number;
        submittedAt: number;
      };
    };
  };
}

const roomQuestionResponses: QuestionResponseStore = {};

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    let currentRoomId: string | null = null;
    let currentUser: { id: string; username: string; avatar?: string } | null = null;

    // 1. Join Study Room
    socket.on('join_room', ({ roomId, user }: { roomId: string; user: { id: string; username: string; avatar?: string } }) => {
      if (!roomId || !user) return;

      currentRoomId = roomId;
      currentUser = user;

      socket.join(roomId);

      // Register or update online member in DB
      const member = db.joinRoom(roomId, user as any);

      // Send current whiteboard state to newly joined member
      if (!whiteboardStores[roomId]) {
        whiteboardStores[roomId] = [];
      }
      socket.emit('whiteboard_state', whiteboardStores[roomId]);

      // Broadcast updated member list to room
      const members = db.getRoomMembers(roomId);
      io.to(roomId).emit('room_members_update', members);

      // Broadcast chat history
      const messages = db.getRoomMessages(roomId);
      socket.emit('chat_history', messages);

      // Broadcast system message
      const sysMsg = db.addChatMessage(roomId, 'system', 'HirePrep System', `${user.username} joined the study room.`);
      io.to(roomId).emit('chat_message', sysMsg);

      console.log(`User ${user.username} joined room ${roomId}`);
    });

    // 2. Select Question for Room
    socket.on('select_room_question', ({ roomId, questionId, question }: { roomId: string; questionId: string; question: any }) => {
      io.to(roomId).emit('room_question_changed', { questionId, question });
    });

    // 3. Update Solving Status
    socket.on('update_member_status', ({ roomId, userId, activity, solvingStatus }: { roomId: string; userId: string; activity: string; solvingStatus?: any }) => {
      db.updateRoomMemberStatus(roomId, userId, activity, solvingStatus);
      const members = db.getRoomMembers(roomId);
      io.to(roomId).emit('room_members_update', members);
    });

    // 4. Live Chat
    socket.on('send_chat_message', ({ roomId, userId, username, avatar, message }: { roomId: string; userId: string; username: string; avatar?: string; message: string }) => {
      if (!message || !message.trim()) return;
      const msg = db.addChatMessage(roomId, userId, username, message.trim(), avatar);
      io.to(roomId).emit('chat_message', msg);
    });

    // 5. Whiteboard Synchronization
    socket.on('request_whiteboard_state', ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      if (!whiteboardStores[roomId]) {
        whiteboardStores[roomId] = [];
      }
      socket.emit('whiteboard_state', whiteboardStores[roomId]);
    });

    socket.on('whiteboard_draw', ({ roomId, element, user }: { roomId: string; element: any; user?: { username: string } }) => {
      if (!roomId) return;
      if (!whiteboardStores[roomId]) {
        whiteboardStores[roomId] = [];
      }
      whiteboardStores[roomId].push(element);
      io.to(roomId).emit('whiteboard_draw', element);
      if (user?.username) {
        socket.to(roomId).emit('whiteboard_active_user', { username: user.username });
      }
    });

    socket.on('whiteboard_clear', ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      whiteboardStores[roomId] = [];
      io.to(roomId).emit('whiteboard_clear');
    });

    socket.on('whiteboard_replace', ({ roomId, elements, username }: { roomId: string; elements: any[]; username?: string }) => {
      if (!roomId) return;
      whiteboardStores[roomId] = elements || [];
      io.to(roomId).emit('whiteboard_state', whiteboardStores[roomId]);
      if (username) {
        socket.to(roomId).emit('whiteboard_active_user', { username });
      }
    });

    socket.on('whiteboard_active_user', ({ username, roomId }: { username: string; roomId: string }) => {
      if (!roomId || !username) return;
      socket.to(roomId).emit('whiteboard_active_user', { username });
    });

    // 6. Member Question Attempt / Option Select Live Sync
    socket.on('member_question_attempt', (data: {
      roomId: string;
      questionId: string;
      userId: string;
      username: string;
      avatar?: string;
      selectedIndex?: number | null;
      isCorrect?: boolean;
      score?: number;
      submissionType?: string;
    }) => {
      if (!data || !data.roomId || !data.questionId) return;

      const { roomId, questionId, userId, username, avatar, selectedIndex, isCorrect, score } = data;

      if (!roomQuestionResponses[roomId]) {
        roomQuestionResponses[roomId] = {};
      }
      if (!roomQuestionResponses[roomId][questionId]) {
        roomQuestionResponses[roomId][questionId] = {};
      }

      if (selectedIndex !== undefined && selectedIndex !== null) {
        roomQuestionResponses[roomId][questionId][userId] = {
          userId,
          username,
          avatar,
          selectedIndex,
          isCorrect: !!isCorrect,
          score: score || 0,
          submittedAt: Date.now(),
        };
      }

      const responsesMap = roomQuestionResponses[roomId][questionId] || {};
      const activeMembers = db.getRoomMembers(roomId).filter((m) => m.isOnline);
      const totalMembersCount = Math.max(activeMembers.length, 1);
      const respondedUserIds = Object.keys(responsesMap);
      const allResponded = activeMembers.length > 0 && activeMembers.every((m) => respondedUserIds.includes(m.userId));

      if (allResponded) {
        // All members have answered! Reveal answers and choices to everyone
        io.to(roomId).emit('room_question_answers_revealed', {
          roomId,
          questionId,
          responses: responsesMap,
          allResponded: true,
        });
      } else {
        // Broadcast secret response notification (showing WHO responded, but NOT their selected option or correctness)
        io.to(roomId).emit('room_question_attempt', {
          roomId,
          questionId,
          userId,
          username,
          avatar,
          hasResponded: true,
          respondedUserIds,
          respondedCount: respondedUserIds.length,
          totalMembersCount,
          allResponded: false,
          timestamp: Date.now(),
        });
      }
    });

    socket.on('host_force_reveal_answers', ({ roomId, questionId }: { roomId: string; questionId: string }) => {
      if (!roomId || !questionId) return;
      const responsesMap = roomQuestionResponses[roomId]?.[questionId] || {};
      io.to(roomId).emit('room_question_answers_revealed', {
        roomId,
        questionId,
        responses: responsesMap,
        forcedByHost: true,
      });
    });

    socket.on('request_question_responses_status', ({ roomId, questionId }: { roomId: string; questionId: string }) => {
      if (!roomId || !questionId) return;
      const responsesMap = roomQuestionResponses[roomId]?.[questionId] || {};
      const activeMembers = db.getRoomMembers(roomId).filter((m) => m.isOnline);
      const respondedUserIds = Object.keys(responsesMap);
      const allResponded = activeMembers.length > 0 && activeMembers.every((m) => respondedUserIds.includes(m.userId));

      if (allResponded) {
        socket.emit('room_question_answers_revealed', {
          roomId,
          questionId,
          responses: responsesMap,
          allResponded: true,
        });
      } else {
        socket.emit('room_question_responses_status', {
          roomId,
          questionId,
          respondedUserIds,
          isRevealed: false,
        });
      }
    });

    // 6. Submission Scoreboard Update
    socket.on('room_submission', ({ roomId, userId, pointsEarned }: { roomId: string; userId: string; pointsEarned: number }) => {
      db.updateRoomMemberScore(roomId, userId, pointsEarned);
      const members = db.getRoomMembers(roomId);
      io.to(roomId).emit('scoreboard_update', members);
      io.to(roomId).emit('room_members_update', members);
    });

    // 7. WebRTC Signaling for Voice/Video Calls
    socket.on('webrtc_offer', ({ roomId, targetUserId, offer, senderUser }: any) => {
      socket.to(roomId).emit('webrtc_offer', { senderSocketId: socket.id, targetUserId, offer, senderUser });
    });

    socket.on('webrtc_answer', ({ roomId, targetSocketId, answer }: any) => {
      io.to(targetSocketId).emit('webrtc_answer', { senderSocketId: socket.id, answer });
    });

    socket.on('webrtc_ice_candidate', ({ roomId, targetSocketId, candidate }: any) => {
      io.to(targetSocketId).emit('webrtc_ice_candidate', { senderSocketId: socket.id, candidate });
    });

    socket.on('toggle_media', ({ roomId, userId, micOn, cameraOn }: { roomId: string; userId: string; micOn: boolean; cameraOn: boolean }) => {
      io.to(roomId).emit('member_media_status', { userId, micOn, cameraOn });
    });

    // 8. Disconnect
    socket.on('disconnect', () => {
      if (currentRoomId && currentUser) {
        const members = db.getRoomMembers(currentRoomId);
        const member = members.find((m) => m.userId === currentUser?.id);
        if (member) {
          member.isOnline = false;
        }
        io.to(currentRoomId).emit('room_members_update', members);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
