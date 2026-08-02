import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.js';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Award,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Question } from '../types.js';

interface CodingPracticePageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const CodingPracticePage: React.FC<CodingPracticePageProps> = ({ question, onBack, onNext, onPrevious }) => {
  const { token } = useAuth();
  const supportedLangs = question.codingData?.supportedLanguages || ['python', 'cpp', 'java', 'c'];
  const starterCodeMap = question.codingData?.starterCode || {};

  const [selectedLang, setSelectedLang] = useState<string>(supportedLangs[0] || 'python');
  const [code, setCode] = useState<string>(starterCodeMap[selectedLang] || starterCodeMap['python'] || '');
  const [activeTab, setActiveTab] = useState<'problem' | 'testcases'>('problem');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [scoreEarned, setScoreEarned] = useState<number>(0);

  const [showSolution, setShowSolution] = useState(false);

  // Reset page state whenever question changes
  useEffect(() => {
    const map = question.codingData?.starterCode || {};
    const defaultLang = question.codingData?.supportedLanguages?.[0] || 'python';
    setSelectedLang(defaultLang);
    setCode(map[defaultLang] || map['python'] || '');
    setTestResults(null);
    setSubmissionStatus(null);
    setFeedbackMsg('');
    setActiveTab('problem');
    setShowSolution(false);
  }, [question.id]);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (starterCodeMap[lang]) {
      setCode(starterCodeMap[lang]);
    }
  };

  const handleResetCode = () => {
    setCode(starterCodeMap[selectedLang] || '');
    setTestResults(null);
    setSubmissionStatus(null);
  };

  const handleSubmitCode = async () => {
    if (!token) return;

    setIsSubmitting(true);
    setTestResults(null);
    setSubmissionStatus(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question.id,
          answerOrCode: code,
          language: selectedLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissionStatus(data.status);
        setFeedbackMsg(data.feedback || '');
        setScoreEarned(data.score || 0);
        setTestResults(data.testCaseResults || []);
        setActiveTab('testcases');

        if (data.status === 'accepted') {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Error submitting code:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {question.categoryName} • Coding
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
              id="btn-next-question-top"
              onClick={onNext}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              title="Next Question"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        {/* Left Panel: Problem Statement & Examples */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs overflow-y-auto max-h-[700px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{question.title}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'problem' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'testcases' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Results {testResults && `(${testResults.filter((t) => t.passed).length}/${testResults.length})`}
                </button>
              </div>
            </div>

            {activeTab === 'problem' ? (
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <p className="text-sm font-medium text-slate-800">{question.description}</p>

                {question.codingData?.inputDescription && (
                  <div className="space-y-1">
                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px]">Input</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800">{question.codingData.inputDescription}</p>
                  </div>
                )}

                {question.codingData?.outputDescription && (
                  <div className="space-y-1">
                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px]">Output</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800">{question.codingData.outputDescription}</p>
                  </div>
                )}

                {question.codingData?.constraints && (
                  <div className="space-y-1">
                    <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">Constraints</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">{question.codingData.constraints}</p>
                  </div>
                )}

                {/* Examples */}
                {question.codingData?.examples && question.codingData.examples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Examples</span>
                    {question.codingData.examples.map((ex, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Input: </span>
                          <span className="text-slate-800">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Output: </span>
                          <span className="text-emerald-700 font-bold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <p className="text-[10px] text-slate-500 font-sans pt-1 border-t border-slate-200">{ex.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Solution / Hint Section (Hidden by Default) */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showSolution ? 'Hide Solution & Hints' : 'Reveal Solution & Hints'}</span>
                  </button>

                  {showSolution && (
                    <div className="mt-3 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-slate-800">
                      <span className="text-[11px] font-bold text-indigo-900 block">Solution & Approach Guidelines</span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        To solve this problem, analyze the constraints and input/output structure. Write your algorithm in the code editor on the right, ensure time/space complexity meets constraints, and click <strong>Submit Solution</strong> to test against test cases.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Test Case Execution Results Tab */
              <div className="space-y-4">
                {submissionStatus ? (
                  <div
                    className={`p-4 rounded-xl border ${
                      submissionStatus === 'accepted'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 font-bold text-sm">
                        {submissionStatus === 'accepted' ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Accepted</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-600" />
                            <span>Rejected</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 font-bold text-xs bg-white px-3 py-1 rounded-full text-amber-700 border border-slate-200 shadow-xs">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>+{scoreEarned} pts</span>
                      </div>
                    </div>
                    <p className="text-xs">{feedbackMsg}</p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Click "Run & Submit" to execute test cases against your solution.
                  </div>
                )}

                {testResults && testResults.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800">Test Cases</span>
                    {testResults.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border font-mono text-[11px] space-y-1.5 ${
                          tc.passed ? 'bg-slate-50 border-emerald-200' : 'bg-slate-50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-bold text-slate-800">Test Case #{idx + 1}</span>
                          {tc.passed ? (
                            <span className="text-emerald-700 text-[10px] font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>PASSED</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 text-[10px] font-bold flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>FAILED</span>
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-500">Input: </span>
                          <span className="text-slate-800">{tc.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Expected: </span>
                          <span className="text-emerald-700">{tc.expected}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Actual: </span>
                          <span className={tc.passed ? 'text-emerald-700' : 'text-rose-700'}>{tc.actual}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          {/* Language Selector & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                {supportedLangs.map((lang) => (
                  <option key={lang} value={lang} className="bg-white text-slate-800">
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetCode}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-run-submit-code"
                disabled={isSubmitting}
                onClick={handleSubmitCode}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:opacity-50 transition"
              >
                {isSubmitting ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run & Submit</span>
                  </>
                )}
              </button>

              {onNext && (
                <button
                  id="btn-next-question-editor"
                  onClick={onNext}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
                  title="Next Question"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Monospaced Code Textarea - Clean Dark Framing for Code */}
          <div className="flex-1 min-h-[450px] relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-4 font-mono text-xs">
            <textarea
              id="code-editor-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your code solution here..."
              spellCheck="false"
              className="w-full h-full bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Console Output Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Execution Engine: Sandboxed Runner Active</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{selectedLang.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
