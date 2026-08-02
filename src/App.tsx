import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { Header } from './components/Header.js';
import { AuthPage } from './pages/AuthPage.js';
import { HomePage } from './pages/HomePage.js';
import { PracticePage } from './pages/PracticePage.js';
import { MCQPage } from './pages/MCQPage.js';
import { CodingPracticePage } from './pages/CodingPracticePage.js';
import { SQLPracticePage } from './pages/SQLPracticePage.js';
import { HRQuestionPage } from './pages/HRQuestionPage.js';
import { StudyRoomsPage } from './pages/StudyRoomsPage.js';
import { StudyRoomWorkspacePage } from './pages/StudyRoomWorkspacePage.js';
import { ProgressPage } from './pages/ProgressPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminPanelPage } from './pages/AdminPanelPage.js';
import { Question } from './types.js';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);

  React.useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllQuestions(data);
      })
      .catch(console.error);
  }, [activeQuestion?.id]);

  const handleNextQuestion = () => {
    if (!activeQuestion || allQuestions.length === 0) return;
    const sameCatAndType = allQuestions.filter(
      (q) => q.categoryId === activeQuestion.categoryId && q.type === activeQuestion.type
    );
    const queue = sameCatAndType.length > 0 ? sameCatAndType : allQuestions;
    const idx = queue.findIndex((q) => q.id === activeQuestion.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % queue.length;
      setActiveQuestion(queue[nextIdx]);
    }
  };

  const handlePrevQuestion = () => {
    if (!activeQuestion || allQuestions.length === 0) return;
    const sameCatAndType = allQuestions.filter(
      (q) => q.categoryId === activeQuestion.categoryId && q.type === activeQuestion.type
    );
    const queue = sameCatAndType.length > 0 ? sameCatAndType : allQuestions;
    const idx = queue.findIndex((q) => q.id === activeQuestion.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + queue.length) % queue.length;
      setActiveQuestion(queue[prevIdx]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Loading HirePrep Platform...</p>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setActiveQuestion(null);
    setActiveRoomId(null);
  };

  // 1. Unauthenticated users see Login / Registration page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // 2. Active Study Room Workspace Fullscreen View
  if (activeRoomId) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header currentTab="rooms" setCurrentTab={handleTabChange} />
        <main className="flex-1">
          <StudyRoomWorkspacePage
            roomId={activeRoomId}
            onLeaveRoom={() => setActiveRoomId(null)}
          />
        </main>
      </div>
    );
  }

  // 3. Single Question Solvers
  if (activeQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header currentTab="practice" setCurrentTab={handleTabChange} />
        <main className="flex-1">
          {activeQuestion.type === 'mcq' && (
            <MCQPage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'coding' && (
            <CodingPracticePage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'sql' && (
            <SQLPracticePage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'hr' && (
            <HRQuestionPage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
        </main>
      </div>
    );
  }

  // 4. Primary App View Tabs
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header currentTab={currentTab} setCurrentTab={handleTabChange} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            setSelectedCategory={setSelectedCategory}
            openCreateRoomModal={() => {
              setCurrentTab('rooms');
              setCreateRoomModalOpen(true);
            }}
          />
        )}

        {currentTab === 'practice' && (
          <PracticePage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectQuestion={(q) => setActiveQuestion(q)}
          />
        )}

        {currentTab === 'rooms' && (
          <StudyRoomsPage
            onEnterRoom={(rId) => setActiveRoomId(rId)}
            createModalOpen={createRoomModalOpen}
            setCreateModalOpen={setCreateRoomModalOpen}
          />
        )}

        {currentTab === 'progress' && <ProgressPage />}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'admin' && <AdminPanelPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HirePrep © 2026. Prepare Together. Get Interview Ready.</span>
          <span className="text-slate-400 font-medium">DSA • SQL • Python • C • C++ • Java</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { Header } from './components/Header.js';
import { AuthPage } from './pages/AuthPage.js';
import { HomePage } from './pages/HomePage.js';
import { PracticePage } from './pages/PracticePage.js';
import { MCQPage } from './pages/MCQPage.js';
import { CodingPracticePage } from './pages/CodingPracticePage.js';
import { SQLPracticePage } from './pages/SQLPracticePage.js';
import { HRQuestionPage } from './pages/HRQuestionPage.js';
import { StudyRoomsPage } from './pages/StudyRoomsPage.js';
import { StudyRoomWorkspacePage } from './pages/StudyRoomWorkspacePage.js';
import { ProgressPage } from './pages/ProgressPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminPanelPage } from './pages/AdminPanelPage.js';
import { Question } from './types.js';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);

  React.useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllQuestions(data);
      })
      .catch(console.error);
  }, [activeQuestion?.id]);

  const handleNextQuestion = () => {
    if (!activeQuestion || allQuestions.length === 0) return;
    const sameCatAndType = allQuestions.filter(
      (q) => q.categoryId === activeQuestion.categoryId && q.type === activeQuestion.type
    );
    const queue = sameCatAndType.length > 0 ? sameCatAndType : allQuestions;
    const idx = queue.findIndex((q) => q.id === activeQuestion.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % queue.length;
      setActiveQuestion(queue[nextIdx]);
    }
  };

  const handlePrevQuestion = () => {
    if (!activeQuestion || allQuestions.length === 0) return;
    const sameCatAndType = allQuestions.filter(
      (q) => q.categoryId === activeQuestion.categoryId && q.type === activeQuestion.type
    );
    const queue = sameCatAndType.length > 0 ? sameCatAndType : allQuestions;
    const idx = queue.findIndex((q) => q.id === activeQuestion.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + queue.length) % queue.length;
      setActiveQuestion(queue[prevIdx]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Loading HirePrep Platform...</p>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setActiveQuestion(null);
    setActiveRoomId(null);
  };

  // 1. Unauthenticated users see Login / Registration page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // 2. Active Study Room Workspace Fullscreen View
  if (activeRoomId) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header currentTab="rooms" setCurrentTab={handleTabChange} />
        <main className="flex-1">
          <StudyRoomWorkspacePage
            roomId={activeRoomId}
            onLeaveRoom={() => setActiveRoomId(null)}
          />
        </main>
      </div>
    );
  }

  // 3. Single Question Solvers
  if (activeQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Header currentTab="practice" setCurrentTab={handleTabChange} />
        <main className="flex-1">
          {activeQuestion.type === 'mcq' && (
            <MCQPage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'coding' && (
            <CodingPracticePage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'sql' && (
            <SQLPracticePage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
          {activeQuestion.type === 'hr' && (
            <HRQuestionPage
              question={activeQuestion}
              onBack={() => setActiveQuestion(null)}
              onNext={handleNextQuestion}
              onPrevious={handlePrevQuestion}
            />
          )}
        </main>
      </div>
    );
  }

  // 4. Primary App View Tabs
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header currentTab={currentTab} setCurrentTab={handleTabChange} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            setSelectedCategory={setSelectedCategory}
            openCreateRoomModal={() => {
              setCurrentTab('rooms');
              setCreateRoomModalOpen(true);
            }}
          />
        )}

        {currentTab === 'practice' && (
          <PracticePage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectQuestion={(q) => setActiveQuestion(q)}
          />
        )}

        {currentTab === 'rooms' && (
          <StudyRoomsPage
            onEnterRoom={(rId) => setActiveRoomId(rId)}
            createModalOpen={createRoomModalOpen}
            setCreateModalOpen={setCreateRoomModalOpen}
          />
        )}

        {currentTab === 'progress' && <ProgressPage />}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'admin' && <AdminPanelPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HirePrep © 2026. Prepare Together. Get Interview Ready.</span>
          <span className="text-slate-400 font-medium">DSA • SQL • Python • C • C++ • Java</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
