import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  User as UserIcon,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');

  const [feedback, setFeedback] = useState<{ success?: boolean; msg?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    const res = await updateProfile({ name, username, avatar }, password || undefined);
    setIsLoading(false);

    if (res.success) {
      setFeedback({ success: true, msg: 'Profile updated successfully!' });
      setPassword('');
    } else {
      setFeedback({ success: false, msg: res.error || 'Failed to update profile' });
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Profile Banner Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative group">
          <img
            src={avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-indigo-600 bg-slate-50 object-cover shadow-xs"
          />
          <button
            onClick={generateRandomAvatar}
            className="absolute bottom-0 right-0 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xs transition"
            title="Generate Random Avatar"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
          <p className="text-xs font-mono text-indigo-700 font-semibold">@{user?.username}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-indigo-600" />
          <span>Edit Profile Credentials</span>
        </h2>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              feedback.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              New Password (Optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="btn-save-profile"
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
