import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Award,
  BarChart2,
  Code2,
  Terminal,
  Database,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Category, UserProgressStats } from '../types.js';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedCategory: (catId: string | null) => void;
  openCreateRoomModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  setSelectedCategory,
  openCreateRoomModal,
}) => {
  const { user, token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<UserProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (token) {
          const statRes = await fetch('/api/user/progress', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (statRes.ok) {
            const statData = await statRes.json();
            setStats(statData);
          }
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentTab('practice');
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'DSA':
        return <Layers className="w-6 h-6 text-indigo-400" />;
      case 'SQL':
        return <Database className="w-6 h-6 text-emerald-400" />;
      case 'PYTHON':
        return <Terminal className="w-6 h-6 text-amber-400" />;
      case 'C':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'C++':
        return <Code2 className="w-6 h-6 text-blue-400" />;
      case 'JAVA':
        return <Code2 className="w-6 h-6 text-rose-400" />;
      case 'QUANTITATIVE APTITUDE':
        return <BarChart2 className="w-6 h-6 text-indigo-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-8 md:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Interview Prep</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || user?.username}! 👋
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            "Practice smarter. Prepare together." Master programming challenges, practice SQL queries, solve MCQs, and collaborate in real-time study rooms with your peers.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              id="btn-start-practicing"
              onClick={() => {
                setSelectedCategory(null);
                setCurrentTab('practice');
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="btn-create-room-hero"
              onClick={openCreateRoomModal}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all shadow-xs"
            >
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Create Study Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <span>Your Practice Statistics</span>
          </h2>
          <button
            onClick={() => setCurrentTab('progress')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="stats-grid">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Questions Solved</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.totalSolved || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Correct Answers</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{stats?.totalCorrect || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Accuracy</span>
              <BarChart2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.accuracy || 0}%</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Coding Solved</span>
              <Code2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-2">{stats?.codingSolved || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>SQL Solved</span>
              <Database className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2">{stats?.sqlSolved || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Study Rooms Joined</span>
              <Users className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-600 mt-2">{stats?.studyRoomsJoined || 0}</p>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Practice Categories</h2>
          <p className="text-sm text-slate-500">Select a topic below to browse MCQs, coding challenges, and SQL problems.</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-grid">
            {categories.map((category) => {
              const catStat = stats?.categoryBreakdown[category.name];
              return (
                <div
                  key={category.id}
                  id={`category-card-${category.name.toLowerCase()}`}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform">
                        {getCategoryIcon(category.name)}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {catStat ? `${catStat.solved} Solved` : 'Practice'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                    <span>Start Practice Session</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
