import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  BarChart2,
  CheckCircle2,
  Award,
  Code2,
  Database,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { UserProgressStats } from '../types.js';

export const ProgressPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<UserProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/user/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching progress stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [token]);

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500">Loading progress analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Page Title Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-3">
            <BarChart2 className="w-7 h-7 text-indigo-600" />
            <span>Your Performance & Progress</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your category mastery, accuracy metrics, and recent practice submission logs.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Questions Solved</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </span>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalSolved || 0}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Total Correct</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </span>
          <p className="text-2xl font-extrabold text-emerald-600">{stats?.totalCorrect || 0}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Accuracy Rate</span>
            <BarChart2 className="w-4 h-4 text-indigo-600" />
          </span>
          <p className="text-2xl font-extrabold text-indigo-700">{stats?.accuracy || 0}%</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>MCQs Solved</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </span>
          <p className="text-2xl font-extrabold text-purple-700">{stats?.mcqsSolved || 0}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Coding Problems</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </span>
          <p className="text-2xl font-extrabold text-blue-700">{stats?.codingSolved || 0}</p>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">Category Progress Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats?.categoryBreakdown &&
            Object.entries(stats.categoryBreakdown).map(([catName, rawStat]) => {
              const catStat = rawStat as { total: number; solved: number };
              const percentage = catStat.total > 0 ? Math.round((catStat.solved / catStat.total) * 100) : 0;
              return (
                <div key={catName} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{catName}</span>
                    <span className="text-indigo-700">{catStat.solved} / {catStat.total} Solved ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent Submission Activity Log */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>Recent Activity History</span>
        </h2>

        {!stats?.recentSubmissions || stats.recentSubmissions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent submissions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{sub.questionTitle}</td>
                    <td className="px-4 py-3 text-indigo-700 font-semibold">{sub.categoryName}</td>
                    <td className="px-4 py-3 uppercase text-[10px] font-mono text-slate-500">{sub.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          sub.status === 'correct' || sub.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-700">+{sub.score} pts</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(sub.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
