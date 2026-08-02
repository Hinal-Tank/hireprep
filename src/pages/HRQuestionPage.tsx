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
  Lock,
  Eye,
  EyeOff,
  Send,
  Star,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../types.js';

interface HRQuestionPageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface AnswerEvaluation {
  score: number;
  gradeLabel: string;
  strengths: string[];
  improvements: string[];
}

export const HRQuestionPage: React.FC<HRQuestionPageProps> = ({
  question,
  onBack,
  onNext,
  onPrevious,
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'sample' | 'breakdown' | 'tips'>('practice');
  const [userPracticeText, setUserPracticeText] = useState('');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const hr = question.hrData;

  const handleEvaluateSolution = () => {
    const trimmed = userPracticeText.trim();
    if (trimmed.length < 20) {
      setValidationError('Please type a more complete answer (at least 20 characters) to receive a rating and evaluation.');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    // Evaluate solution parameters
    const len = trimmed.length;
    let score = 6.0;

    if (len > 300) score += 2.0;
    else if (len > 120) score += 1.5;
    else score += 0.5;

    const lower = trimmed.toLowerCase();
    const hasStar = /situation|task|action|result|when|project|team|role|problem|solved|led|achieved|learned/i.test(lower);
    if (hasStar) score += 1.0;

    const hasNumbers = /\b\d+(%|k|m|x|users|days|weeks|months|projects|team|students)?\b/i.test(lower);
    if (hasNumbers) score += 0.5;

    score = Math.min(10.0, Math.max(5.0, Math.round(score * 10) / 10));

    let gradeLabel = 'Good Attempt!';
    if (score >= 9.0) gradeLabel = 'Outstanding - Interview Ready! 🌟';
    else if (score >= 8.0) gradeLabel = 'Great Answer! Highly Competent 👍';
    else if (score >= 7.0) gradeLabel = 'Solid Response - Well Structured';

    const strengths: string[] = [];
    if (len > 120) strengths.push('Good detail depth and contextual explanation.');
    if (hasStar) strengths.push('Clear problem-solving approach and personal role ownership.');
    if (hasNumbers) strengths.push('Included quantifiable metrics or tangible references.');
    if (strengths.length === 0) strengths.push('Directly addresses the interview question asked.');

    const improvements: string[] = [];
    if (!hasNumbers) improvements.push('Add specific numbers or metrics (e.g. improved performance by 20%, led 4 team members).');
    if (!hasStar) improvements.push('Use the STAR method (Situation, Task, Action, Result) to make your narrative punchy.');
    if (len < 150) improvements.push('Elaborate slightly more on the key actions you personally took.');

    const resultEval: AnswerEvaluation = {
      score,
      gradeLabel,
      strengths,
      improvements,
    };

    setTimeout(() => {
      setEvaluation(resultEval);
      setIsSubmitting(false);
      setShowSampleAnswer(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      fetch(`/api/questions/${question.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerOrCode: trimmed, score: Math.round(score), status: 'correct' }),
      }).catch(console.error);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </button>

        <div className="flex items-center space-x-2">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
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
      <div className="flex items-center justify-between border-b border-slate-200 overflow-x-auto pb-1 gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Draft Solution & Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sample Answer</span>
            {!showSampleAnswer && <Lock className="w-3.5 h-3.5 text-amber-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Answer Analysis</span>
            {!showSampleAnswer && <Lock className="w-3.5 h-3.5 text-amber-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Tips & Pitfalls</span>
          </button>
        </div>

        {/* Reveal Toggle Button */}
        <button
          onClick={() => setShowSampleAnswer(!showSampleAnswer)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            showSampleAnswer
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          {showSampleAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-600" />}
          <span>{showSampleAnswer ? 'Hide Sample Answer' : 'Reveal Sample Answer'}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Tab 1: Practice Sandbox (Default view where user drafts solution) */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Write Your Answer Solution</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Model answer is hidden until you submit or reveal.
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Rehearse and structure your personal response using the STAR method (Situation, Task, Action, Result). Click <strong>Submit & Rate Solution</strong> to evaluate your response quality!
              </p>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <textarea
                value={userPracticeText}
                onChange={(e) => setUserPracticeText(e.target.value)}
                placeholder="Type your personal answer here (e.g. 'In my previous internship project, I was assigned to...')..."
                rows={7}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  {showSampleAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSampleAnswer ? 'Hide Sample Answer' : 'Directly Reveal Sample Answer'}</span>
                </button>

                <button
                  onClick={handleEvaluateSolution}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit & Rate Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rating & Evaluation Feedback Card */}
            {evaluation && (
              <div className="bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 p-6 rounded-2xl border border-indigo-200 shadow-xs space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                      {evaluation.score}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{evaluation.gradeLabel}</h4>
                      <p className="text-xs text-indigo-700 font-medium">Rated out of 10.0</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('sample')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Compare with Model Sample Answer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Strengths Identified</span>
                    </h5>
                    <ul className="text-xs text-emerald-800 space-y-1 pl-4 list-disc">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Recommendations to Excel</span>
                    </h5>
                    <ul className="text-xs text-amber-800 space-y-1 pl-4 list-disc">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sample Answer */}
        {activeTab === 'sample' && (
          <div className="space-y-4">
            {!showSampleAnswer ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Model Answer is Currently Hidden</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  To get maximum value, draft your own response first in the <strong>Draft Solution</strong> tab and submit for rating, or click below to reveal the model sample answer.
                </p>
                <button
                  onClick={() => setShowSampleAnswer(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Sample Answer</span>
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Interview-Ready Sample Answer</span>
                  </h3>
                  {hr?.rating && (
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                      Benchmark Score: {hr.rating}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {hr?.sampleAnswer || 'No sample answer available.'}
                </div>

                <div className="text-xs text-slate-500 italic bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg">
                  💡 <strong>Pro Tip:</strong> Personalize this answer with your actual projects, metrics, and genuine experiences before your real interview!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Answer Analysis */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4">
            {!showSampleAnswer ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Answer Analysis is Hidden</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Write your response or click below to reveal the full breakdown and strategy.
                </p>
                <button
                  onClick={() => setShowSampleAnswer(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Breakdown & Strategy</span>
                </button>
              </div>
            ) : (
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
          </div>
        )}

        {/* Tab 4: Tips & Avoid */}
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
      </div>
    </div>
  );
};
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
  Lock,
  Eye,
  EyeOff,
  Send,
  Star,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../types.js';

interface HRQuestionPageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface AnswerEvaluation {
  score: number;
  gradeLabel: string;
  strengths: string[];
  improvements: string[];
}

export const HRQuestionPage: React.FC<HRQuestionPageProps> = ({
  question,
  onBack,
  onNext,
  onPrevious,
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'sample' | 'breakdown' | 'tips'>('practice');
  const [userPracticeText, setUserPracticeText] = useState('');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const hr = question.hrData;

  const handleEvaluateSolution = () => {
    const trimmed = userPracticeText.trim();
    if (trimmed.length < 20) {
      setValidationError('Please type a more complete answer (at least 20 characters) to receive a rating and evaluation.');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    // Evaluate solution parameters
    const len = trimmed.length;
    let score = 6.0;

    if (len > 300) score += 2.0;
    else if (len > 120) score += 1.5;
    else score += 0.5;

    const lower = trimmed.toLowerCase();
    const hasStar = /situation|task|action|result|when|project|team|role|problem|solved|led|achieved|learned/i.test(lower);
    if (hasStar) score += 1.0;

    const hasNumbers = /\b\d+(%|k|m|x|users|days|weeks|months|projects|team|students)?\b/i.test(lower);
    if (hasNumbers) score += 0.5;

    score = Math.min(10.0, Math.max(5.0, Math.round(score * 10) / 10));

    let gradeLabel = 'Good Attempt!';
    if (score >= 9.0) gradeLabel = 'Outstanding - Interview Ready! 🌟';
    else if (score >= 8.0) gradeLabel = 'Great Answer! Highly Competent 👍';
    else if (score >= 7.0) gradeLabel = 'Solid Response - Well Structured';

    const strengths: string[] = [];
    if (len > 120) strengths.push('Good detail depth and contextual explanation.');
    if (hasStar) strengths.push('Clear problem-solving approach and personal role ownership.');
    if (hasNumbers) strengths.push('Included quantifiable metrics or tangible references.');
    if (strengths.length === 0) strengths.push('Directly addresses the interview question asked.');

    const improvements: string[] = [];
    if (!hasNumbers) improvements.push('Add specific numbers or metrics (e.g. improved performance by 20%, led 4 team members).');
    if (!hasStar) improvements.push('Use the STAR method (Situation, Task, Action, Result) to make your narrative punchy.');
    if (len < 150) improvements.push('Elaborate slightly more on the key actions you personally took.');

    const resultEval: AnswerEvaluation = {
      score,
      gradeLabel,
      strengths,
      improvements,
    };

    setTimeout(() => {
      setEvaluation(resultEval);
      setIsSubmitting(false);
      setShowSampleAnswer(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      fetch(`/api/questions/${question.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerOrCode: trimmed, score: Math.round(score), status: 'correct' }),
      }).catch(console.error);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </button>

        <div className="flex items-center space-x-2">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
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
      <div className="flex items-center justify-between border-b border-slate-200 overflow-x-auto pb-1 gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Draft Solution & Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sample Answer</span>
            {!showSampleAnswer && <Lock className="w-3.5 h-3.5 text-amber-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Answer Analysis</span>
            {!showSampleAnswer && <Lock className="w-3.5 h-3.5 text-amber-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Tips & Pitfalls</span>
          </button>
        </div>

        {/* Reveal Toggle Button */}
        <button
          onClick={() => setShowSampleAnswer(!showSampleAnswer)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            showSampleAnswer
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          {showSampleAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-600" />}
          <span>{showSampleAnswer ? 'Hide Sample Answer' : 'Reveal Sample Answer'}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Tab 1: Practice Sandbox (Default view where user drafts solution) */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Write Your Answer Solution</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Model answer is hidden until you submit or reveal.
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Rehearse and structure your personal response using the STAR method (Situation, Task, Action, Result). Click <strong>Submit & Rate Solution</strong> to evaluate your response quality!
              </p>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <textarea
                value={userPracticeText}
                onChange={(e) => setUserPracticeText(e.target.value)}
                placeholder="Type your personal answer here (e.g. 'In my previous internship project, I was assigned to...')..."
                rows={7}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  {showSampleAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSampleAnswer ? 'Hide Sample Answer' : 'Directly Reveal Sample Answer'}</span>
                </button>

                <button
                  onClick={handleEvaluateSolution}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit & Rate Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rating & Evaluation Feedback Card */}
            {evaluation && (
              <div className="bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 p-6 rounded-2xl border border-indigo-200 shadow-xs space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                      {evaluation.score}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{evaluation.gradeLabel}</h4>
                      <p className="text-xs text-indigo-700 font-medium">Rated out of 10.0</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('sample')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Compare with Model Sample Answer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Strengths Identified</span>
                    </h5>
                    <ul className="text-xs text-emerald-800 space-y-1 pl-4 list-disc">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Recommendations to Excel</span>
                    </h5>
                    <ul className="text-xs text-amber-800 space-y-1 pl-4 list-disc">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sample Answer */}
        {activeTab === 'sample' && (
          <div className="space-y-4">
            {!showSampleAnswer ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Model Answer is Currently Hidden</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  To get maximum value, draft your own response first in the <strong>Draft Solution</strong> tab and submit for rating, or click below to reveal the model sample answer.
                </p>
                <button
                  onClick={() => setShowSampleAnswer(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Sample Answer</span>
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Interview-Ready Sample Answer</span>
                  </h3>
                  {hr?.rating && (
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                      Benchmark Score: {hr.rating}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {hr?.sampleAnswer || 'No sample answer available.'}
                </div>

                <div className="text-xs text-slate-500 italic bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg">
                  💡 <strong>Pro Tip:</strong> Personalize this answer with your actual projects, metrics, and genuine experiences before your real interview!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Answer Analysis */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4">
            {!showSampleAnswer ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Answer Analysis is Hidden</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Write your response or click below to reveal the full breakdown and strategy.
                </p>
                <button
                  onClick={() => setShowSampleAnswer(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Breakdown & Strategy</span>
                </button>
              </div>
            ) : (
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
          </div>
        )}

        {/* Tab 4: Tips & Avoid */}
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
      </div>
    </div>
  );
};
