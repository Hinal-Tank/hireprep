import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.js';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Question } from '../types.js';

interface MCQPageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const MCQPage: React.FC<MCQPageProps> = ({ question, onBack, onNext, onPrevious }) => {
  const { token } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: string;
    score: number;
    explanation: string;
    isCorrect: boolean;
  } | null>(null);

  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    setSelectedIndex(null);
    setSubmitted(false);
    setResult(null);
    setShowExplanation(false);
  }, [question.id]);

  const handleSubmit = async () => {
    if (selectedIndex === null || !token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedIndex,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const isCorrect = data.status === 'correct';
        setResult({
          status: data.status,
          score: data.score,
          explanation: data.feedback || question.mcqData?.explanation || '',
          isCorrect,
        });
        setSubmitted(true);

        if (isCorrect) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Error submitting MCQ:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = question.mcqData?.options || [];
  const correctAnswer = question.mcqData?.correctAnswer ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {question.categoryName} • MCQ
          </span>

          {onPrevious && (
            <button
              onClick={onPrevious}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shadow-xs transition"
              title="Previous Question"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
          )}

          {onNext && (
            <button
              id="btn-next-mcq-top"
              onClick={onNext}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              title="Next Question"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main MCQ Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 mt-1">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {question.title}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {question.description}
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2" id="mcq-options-list">
          {options.map((opt, idx) => {
            let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100/80';

            if (selectedIndex === idx && !submitted) {
              optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs ring-1 ring-indigo-600/30';
            }

            if (submitted) {
              if (idx === correctAnswer) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
              } else if (selectedIndex === idx && idx !== correctAnswer) {
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-900';
              }
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm transition-all duration-150 ${optionStyle}`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {submitted && idx === correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                {submitted && selectedIndex === idx && idx !== correctAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit Action */}
        {!submitted ? (
          <div className="pt-4 flex justify-end">
            <button
              id="btn-submit-mcq"
              disabled={selectedIndex === null || isSubmitting}
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Answer'}</span>
            </button>
          </div>
        ) : (
          /* Submission Feedback Box */
          <div className="pt-4 space-y-4">
            <div
              className={`p-5 rounded-xl border ${
                result?.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 font-bold text-base">
                  {result?.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Incorrect Answer</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 font-bold text-xs bg-white px-3 py-1 rounded-full text-amber-700 border border-slate-200 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>+{result?.score || 0} pts</span>
                </div>
              </div>

              <div className="text-xs pt-3 border-t border-slate-200/60">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="inline-flex items-center space-x-1.5 font-semibold text-indigo-700 bg-white/80 hover:bg-white border border-indigo-200 px-3 py-1.5 rounded-lg transition text-xs shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                </button>

                {showExplanation && (
                  <div className="mt-2.5 p-3 bg-white/90 rounded-lg border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Explanation & Concept:</p>
                    <p className="text-slate-700 leading-relaxed">{result?.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedIndex(null);
                  setResult(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Try Again
              </button>

              {onNext && (
                <button
                  onClick={onNext}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition shadow-xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
