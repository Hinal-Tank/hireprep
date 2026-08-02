import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldAlert,
  Users,
  BookOpen,
  BarChart2,
  Trash2,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  Edit2,
} from 'lucide-react';
import { User, Question, Category, AdminStats } from '../types.js';

export const AdminPanelPage: React.FC = () => {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'questions' | 'categories'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  // Add Question Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const [qTitle, setQTitle] = useState('');
  const [qCategoryId, setQCategoryId] = useState('');
  const [qType, setQType] = useState<'mcq' | 'coding'>('mcq');
  const [qDescription, setQDescription] = useState('');

  // MCQ form data
  const [mcqOpts, setMcqOpts] = useState<string[]>(['', '', '', '']);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');

  // Coding form data
  const [starterPy, setStarterPy] = useState('');
  const [tcInput, setTcInput] = useState('');
  const [tcOutput, setTcOutput] = useState('');

  // SQL form data
  const [sqlSchema, setSqlSchema] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');

  // Add Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const usersRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) setUserList(await usersRes.json());

      const qRes = await fetch('/api/questions');
      if (qRes.ok) setQuestionList(await qRes.json());

      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const cats = await catRes.json();
        setCategoryList(cats);
        if (cats.length > 0) setQCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Error fetching admin panel data:', err);
    }
  };

  // User Actions
  const toggleUserStatus = async (targetUser: User) => {
    if (!token) return;
    const newStatus = targetUser.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Delete Question
  const deleteQuestion = async (qId: string) => {
    if (!token || !window.confirm('Delete this question permanently?')) return;
    try {
      const res = await fetch(`/api/questions/${qId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  // Save Question (Create or Edit)
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !qTitle || !qDescription || !qCategoryId) return;

    const selectedCat = categoryList.find((c) => c.id === qCategoryId);

    const questionData: any = {
      categoryId: qCategoryId,
      categoryName: selectedCat?.name || 'DSA',
      type: qType,
      title: qTitle,
      description: qDescription,
    };

    if (qType === 'mcq') {
      questionData.mcqData = {
        options: mcqOpts,
        correctAnswer: mcqCorrect,
        explanation: mcqExplanation,
      };
    } else if (qType === 'coding') {
      questionData.codingData = {
        supportedLanguages: ['python', 'cpp', 'java', 'c'],
        starterCode: { python: starterPy || 'def solution():\n    pass' },
        testCases: [{ input: tcInput, expectedOutput: tcOutput }],
      };
    } else if (qType === 'sql') {
      questionData.sqlData = {
        schema: sqlSchema || `CREATE TABLE data (id INT, value TEXT);`,
        sampleData: `INSERT INTO data VALUES (1, 'Sample');`,
        correctQuery: sqlQuery || `SELECT * FROM data;`,
        expectedResult: [],
      };
    }

    try {
      const url = editingQuestionId ? `/api/questions/${editingQuestionId}` : '/api/questions';
      const method = editingQuestionId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      if (res.ok) {
        setShowQuestionModal(false);
        setEditingQuestionId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !catName || !catDesc) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: catName, description: catDesc }),
      });

      if (res.ok) {
        setShowCategoryModal(false);
        setCatName('');
        setCatDesc('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-xs font-sans">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500">The Admin Panel is reserved strictly for platform administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Admin Panel Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Owner Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">Manage platform users, questions bank, categories, and review submission analytics.</p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Users ({userList.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'questions' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Questions ({questionList.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'categories' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </span>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Total Questions</span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </span>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.totalQuestions || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Total Submissions</span>
              <BarChart2 className="w-4 h-4 text-purple-600" />
            </span>
            <p className="text-3xl font-extrabold text-purple-700">{stats?.totalSubmissions || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Active Study Rooms</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </span>
            <p className="text-3xl font-extrabold text-emerald-700">{stats?.activeStudyRooms || 0}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Solved Today</span>
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
            </span>
            <p className="text-3xl font-extrabold text-amber-700">{stats?.questionsSolvedToday || 0}</p>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Platform Registered Users</h2>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userList
                  .filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.username.toLowerCase().includes(userSearch.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 flex items-center space-x-2.5">
                        <img src={u.avatar} alt="Avatar" className="w-7 h-7 rounded-full bg-slate-100" />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-indigo-700 font-semibold">@{u.username}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(u)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold transition"
                            >
                              {u.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1 text-rose-600 hover:text-rose-800 transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Manage Practice Questions</h2>
            <button
              onClick={() => {
                setEditingQuestionId(null);
                setQTitle('');
                setQDescription('');
                setShowQuestionModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {questionList.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{q.title}</td>
                    <td className="px-4 py-3 text-indigo-700 font-semibold">{q.categoryName}</td>
                    <td className="px-4 py-3 uppercase font-mono text-[10px] text-slate-500">{q.type}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 transition"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Platform Categories</h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryList.map((cat) => (
              <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-900">Add Question</h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={qCategoryId}
                    onChange={(e) => setQCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Problem Statement</label>
                <textarea
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              {qType === 'mcq' && (
                <div className="space-y-2 pt-2">
                  <span className="font-bold text-indigo-700">MCQ Options (0-3)</span>
                  {mcqOpts.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...mcqOpts];
                        newOpts[idx] = e.target.value;
                        setMcqOpts(newOpts);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  ))}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Correct Answer Index (0-3)</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={mcqCorrect}
                      onChange={(e) => setMcqCorrect(parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              )}

              {qType === 'coding' && (
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Starter Code (Python)</label>
                    <textarea
                      value={starterPy}
                      onChange={(e) => setStarterPy(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tcInput}
                      onChange={(e) => setTcInput(e.target.value)}
                      placeholder="Test Case Input"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                    <input
                      type="text"
                      value={tcOutput}
                      onChange={(e) => setTcOutput(e.target.value)}
                      placeholder="Expected Output"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                </div>
              )}

              {qType === 'sql' && (
                <div className="space-y-2 pt-2">
                  <textarea
                    value={sqlSchema}
                    onChange={(e) => setSqlSchema(e.target.value)}
                    placeholder="CREATE TABLE ..."
                    rows={2}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  />
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Correct Query (SELECT ...)"
                    rows={2}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition"
              >
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. JavaScript, Go, Kotlin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Practice..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
