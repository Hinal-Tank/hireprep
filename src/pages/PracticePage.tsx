import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Database,
  Layers,
  ArrowRight,
  BarChart2,
  MessageSquare,
} from 'lucide-react';
import { Question, Category } from '../types.js';

interface PracticePageProps {
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  onSelectQuestion: (question: Question) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  selectedCategory,
  setSelectedCategory,
  onSelectQuestion,
}) => {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [solvedFilter, setSolvedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, typeFilter, solvedFilter, token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (user?.id) params.append('userId', user.id);

      const res = await fetch(`/api/questions?${params.toString()}`);
      if (res.ok) {
        let data: Question[] = await res.json();

        // Solved/Unsolved Filter
        if (solvedFilter === 'solved') {
          data = data.filter((q) => q.solved);
        } else if (solvedFilter === 'unsolved') {
          data = data.filter((q) => !q.solved);
        }

        setQuestions(data);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'mcq':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>MCQ</span>
          </span>
        );
      case 'coding':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Code2 className="w-3.5 h-3.5" />
            <span>Coding</span>
          </span>
        );
      case 'sql':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Database className="w-3.5 h-3.5" />
            <span>SQL</span>
          </span>
        );
      case 'hr':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>HR Interview</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Category Selection Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" id="category-pills">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>{activeCategoryObj ? `${activeCategoryObj.name} Practice` : 'All Practice Questions'}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeCategoryObj ? activeCategoryObj.description : 'Select and practice questions from Quantitative Aptitude, DSA, SQL, Python, C, C++, Java.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 font-medium">
          Showing <span className="text-indigo-600 font-bold">{filteredQuestions.length}</span> question(s)
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by title or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Question Type Filter */}
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none w-full cursor-pointer"
          >
            <option value="all" className="bg-white text-slate-800">All Types</option>
            <option value="mcq" className="bg-white text-slate-800">MCQ</option>
            <option value="coding" className="bg-white text-slate-800">Coding</option>
            <option value="sql" className="bg-white text-slate-800">SQL</option>
          </select>
        </div>

        {/* Solved Status Filter */}
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={solvedFilter}
            onChange={(e) => setSolvedFilter(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none w-full cursor-pointer"
          >
            <option value="all" className="bg-white text-slate-800">All Statuses</option>
            <option value="solved" className="bg-white text-slate-800">Solved</option>
            <option value="unsolved" className="bg-white text-slate-800">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Question Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">Loading practice questions...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No questions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search or filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="questions-list">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              onClick={() => onSelectQuestion(q)}
              className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {q.categoryName}
                  </span>
                  {getTypeBadge(q.type)}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {q.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
                  {q.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {q.solved ? (
                  <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solved</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
                    <XCircle className="w-4 h-4" />
                    <span>Unsolved</span>
                  </span>
                )}

                <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 flex items-center space-x-1">
                  <span>Solve Question</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
