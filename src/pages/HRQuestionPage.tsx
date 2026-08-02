import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Award,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Question } from '../types.js';

interface HRQuestionPageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const HRQuestionPage: React.FC<HRQuestionPageProps> = ({
  question,
  onBack,
  onNext,
  onPrevious,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'breakdown' | 'tips' | 'practice'>('sample');
  const [userPracticeText, setUserPracticeText] = useState('');
  const [isPracticed, setIsPracticed] = useState(false);

  const hr = question.hrData;

  const handleMarkPracticed = () => {
    setIsPracticed(true);
    fetch(`/api/questions/${question.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answerOrCode: userPracticeText || 'Practiced', score: 10, status: 'correct' }),
    }).catch(console.error);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </button>

        <div className="flex items-center space-x-2">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all"
              title="Next Question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Question Display Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold rounded-full uppercase tracking-wider">
            HR & Behavioral Interview
          </span>
          {hr?.rating && (
            <div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <Award className="w-4 h-4" />
              <span>Target Rating: {hr.rating}</span>
            </div>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
          {question.title}
        </h1>

        <p className="text-slate-200 text-sm leading-relaxed border-t border-indigo-500/20 pt-4">
          {question.description}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sample'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Sample Answer</span>
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'breakdown'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Answer Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'tips'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Tips & Common Pitfalls</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'practice'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Your Practice Sandbox</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Tab 1: Sample Answer */}
        {activeTab === 'sample' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Interview-Ready Sample Answer</span>
              </h3>
              {hr?.rating && (
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  Score: {hr.rating}
                </span>
              )}
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
              {hr?.sampleAnswer || 'No sample answer available.'}
            </div>

            <div className="text-xs text-slate-500 italic bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg">
              💡 <strong>Pro Tip:</strong> Personalize this answer with your actual projects, metrics, and genuine experiences before your interview!
            </div>
          </div>
        )}

        {/* Tab 2: Answer Analysis */}
        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why This Works */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Why This Works</span>
              </h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {hr?.whyThisWorks || 'Demonstrates clear communication, relevance, and candidate confidence.'}
              </div>
            </div>

            {/* How to Improve */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>How to Improve It Further</span>
              </h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {hr?.improveItBy || 'Quantify results with numbers, metrics, or specific project outcomes.'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Tips & Avoid */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What to Avoid */}
            {hr?.avoid && (
              <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-rose-900 flex items-center space-x-2 border-b border-rose-100 pb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>What to Avoid</span>
                </h3>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {hr.avoid}
                </div>
              </div>
            )}

            {/* Notes & Tips */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Interview Notes & Guidelines</span>
              </h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {hr?.importantNotes || 'Keep your response under 2 minutes. Structure with the STAR method (Situation, Task, Action, Result).'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Practice Sandbox */}
        {activeTab === 'practice' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Draft Your Own Custom Answer</span>
            </h3>

            <p className="text-xs text-slate-500">
              Type your personalized answer below to rehearse and refine your response before the real interview.
            </p>

            <textarea
              value={userPracticeText}
              onChange={(e) => setUserPracticeText(e.target.value)}
              placeholder="Type your personal answer response here..."
              rows={8}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
            />

            <div className="flex items-center justify-between pt-2">
              {isPracticed ? (
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Answer Saved & Marked Practiced!</span>
                </span>
              ) : (
                <button
                  onClick={handleMarkPracticed}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Mark Practiced</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
