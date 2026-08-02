import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Users,
  PlusCircle,
  LogIn,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { StudyRoom } from '../types.js';

interface StudyRoomsPageProps {
  onEnterRoom: (roomId: string) => void;
  createModalOpen?: boolean;
  setCreateModalOpen?: (open: boolean) => void;
}

export const StudyRoomsPage: React.FC<StudyRoomsPageProps> = ({
  onEnterRoom,
  createModalOpen = false,
  setCreateModalOpen,
}) => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Create Room Form
  const [showCreateModal, setShowCreateModal] = useState(createModalOpen);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [createdRoom, setCreatedRoom] = useState<StudyRoom | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [token]);

  useEffect(() => {
    if (createModalOpen) {
      setShowCreateModal(true);
    }
  }, [createModalOpen]);

  const fetchRooms = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Error fetching study rooms:', err);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !token) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roomName.trim(),
          description: roomDescription.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedRoom(data);
        fetchRooms();
      } else {
        setErrorMsg(data.error || 'Failed to create room');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinByCode = async (codeToJoin?: string) => {
    const targetCode = (codeToJoin || joinCodeInput).trim().toUpperCase();
    if (!targetCode || !token) return;

    setErrorMsg('');
    try {
      const res = await fetch(`/api/rooms/code/${targetCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const room = await res.json();
        onEnterRoom(room.id);
      } else {
        setErrorMsg('Invalid Room ID or Room not found');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Room lookup error');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Workspaces</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Rooms</h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Create private study rooms, invite friends using a unique Room ID, solve coding/SQL problems together, use a collaborative whiteboard, live chat, and voice/video calling!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-open-create-room-modal"
            onClick={() => {
              setShowCreateModal(true);
              setCreatedRoom(null);
              setErrorMsg('');
              if (setCreateModalOpen) setCreateModalOpen(false);
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Room</span>
          </button>
        </div>
      </div>

      {/* Join Room by Room ID Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center space-x-2">
          <LogIn className="w-5 h-5 text-indigo-600" />
          <span>Join Private Study Room</span>
        </h2>
        <p className="text-slate-500 text-xs">Enter a 7-character Room ID provided by your friend (e.g., HP-A7K29)</p>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <input
            id="input-join-room-id"
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
            placeholder="HP-A7K29"
            maxLength={10}
            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-center font-mono font-bold text-base tracking-widest uppercase"
          />
          <button
            id="btn-join-room-submit"
            onClick={() => handleJoinByCode()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition whitespace-nowrap"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Directory of Active Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Active Public Study Rooms</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Filter rooms..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-400 text-xs shadow-xs">
            No active study rooms available. Click "Create New Room" above to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="rooms-grid">
            {rooms
              .filter((r) => r.name.toLowerCase().includes(searchCode.toLowerCase()) || r.roomId.includes(searchCode.toUpperCase()))
              .map((room) => (
                <div
                  key={room.id}
                  id={`room-card-${room.id}`}
                  className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-indigo-700 border border-slate-200">
                        {room.roomId}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-indigo-600" />
                        <span>Host: {room.hostName}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{room.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.description || 'Collaborative interview practice study room.'}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Created {new Date(room.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onEnterRoom(room.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-6">
            {!createdRoom ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>Create Private Study Room</span>
                  </h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      if (setCreateModalOpen) setCreateModalOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g. Algo Experts Prep Session"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      value={roomDescription}
                      onChange={(e) => setRoomDescription(e.target.value)}
                      placeholder="What topics are you practicing today?"
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    {isLoading ? 'Creating...' : 'Generate Room ID'}
                  </button>
                </form>
              </>
            ) : (
              /* Created Room Success Display */
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">Study Room Created!</h3>
                <p className="text-xs text-slate-500">Share this Room ID with your friends to let them join:</p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xl font-extrabold text-indigo-700 tracking-widest">
                    {createdRoom.roomId}
                  </span>
                  <button
                    onClick={() => handleCopyCode(createdRoom.roomId)}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition flex items-center space-x-1 text-xs shadow-xs"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    if (setCreateModalOpen) setCreateModalOpen(false);
                    onEnterRoom(createdRoom.id);
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Enter Room Workspace Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
