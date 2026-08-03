import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from './db.js';

interface WhiteboardStateMap {
  [roomId: string]: any[];
}

const whiteboardStores: WhiteboardStateMap = {};

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
      socket.to(roomId).emit('whiteboard_draw', element);
      if (user?.username) {
        socket.to(roomId).emit('whiteboard_active_user', { username: user.username });
      }
    });

    socket.on('whiteboard_clear', ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      whiteboardStores[roomId] = [];
      io.to(roomId).emit('whiteboard_clear');
    });

    socket.on('whiteboard_replace', ({ roomId, elements }: { roomId: string; elements: any[] }) => {
      if (!roomId) return;
      whiteboardStores[roomId] = elements;
      socket.to(roomId).emit('whiteboard_state', elements);
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
      if (!data || !data.roomId) return;
      // Broadcast attempt/selection to all members in the room including sender
      io.to(data.roomId).emit('room_question_attempt', data);
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
