import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.js';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Table as TableIcon,
  Award,
  Sparkles,
} from 'lucide-react';
import { Question } from '../types.js';

interface SQLPracticePageProps {
  question: Question;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const SQLPracticePage: React.FC<SQLPracticePageProps> = ({ question, onBack, onNext, onPrevious }) => {
  const { token } = useAuth();
  const defaultQuery = '-- Write your SQL query below:\n';

  const [query, setQuery] = useState<string>(defaultQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [scoreEarned, setScoreEarned] = useState<number>(0);
  const [resultTable, setResultTable] = useState<{ columns: string[]; rows: any[][] } | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setQuery('-- Write your SQL query below:\n');
    setSubmissionStatus(null);
    setFeedbackMsg('');
    setResultTable(null);
    setShowSolution(false);
  }, [question.id]);

  const handleResetQuery = () => {
    setQuery(defaultQuery);
    setSubmissionStatus(null);
    setResultTable(null);
  };

  const handleSubmitQuery = async () => {
    if (!token) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setResultTable(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question.id,
          answerOrCode: query,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissionStatus(data.status);
        setFeedbackMsg(data.feedback || '');
        setScoreEarned(data.score || 0);

        if (data.sqlResult) {
          setResultTable(data.sqlResult);
        }

        if (data.status === 'correct') {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Error submitting SQL query:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleTables = question.sqlData?.sampleTables || [];

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
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {question.categoryName} • SQL Practice
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
              id="btn-next-sql-top"
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

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Panel: Problem Statement & Database Schema */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs overflow-y-auto max-h-[700px]">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">{question.title}</h1>
            <p className="text-xs text-slate-600 leading-relaxed">{question.description}</p>

            {/* Table Schema View */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 uppercase tracking-wider">
                <TableIcon className="w-4 h-4" />
                <span>Database Tables & Sample Data</span>
              </span>

              {sampleTables.map((tbl, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <span className="font-mono text-xs font-bold text-indigo-700">{tbl.name}</span>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                          {tbl.columns.map((col, cIdx) => (
                            <th key={cIdx} className="px-3 py-1.5 font-semibold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((val: any, vIdx: number) => (
                              <td key={vIdx} className="px-3 py-1.5">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Solution Query (Hidden by Default) */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showSolution ? 'Hide Solution Query' : 'Reveal Solution Query'}</span>
              </button>

              {showSolution && (
                <div className="mt-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-slate-100 font-mono text-xs shadow-xs">
                  <span className="text-[11px] font-bold text-amber-400 block font-sans uppercase tracking-wider">
                    Reference Solution Query
                  </span>
                  <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                    {question.sqlData?.correctQuery || 'SELECT * FROM employees;'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: SQL Query Editor & Query Results */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">SQL Editor</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetQuery}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                title="Reset Query"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-run-sql-query"
                disabled={isSubmitting}
                onClick={handleSubmitQuery}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:opacity-50 transition"
              >
                {isSubmitting ? (
                  <span>Executing...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Query & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="h-44 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-4 font-mono text-xs">
            <textarea
              id="sql-editor-textarea"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="-- Write your SQL query here..."
              spellCheck="false"
              className="w-full h-full bg-transparent text-emerald-300 resize-none focus:outline-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Submission Feedback & Results Display */}
          <div className="flex-1 space-y-3">
            {submissionStatus && (
              <div
                className={`p-3.5 rounded-xl border ${
                  submissionStatus === 'correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    {submissionStatus === 'correct' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Query Result Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Result Mismatch or Error</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-[11px] bg-white px-2.5 py-0.5 rounded-full text-amber-700 border border-slate-200 shadow-xs">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>+{scoreEarned} pts</span>
                  </div>
                </div>
                <p className="text-[11px] mt-1">{feedbackMsg}</p>
              </div>
            )}

            {/* Render Output Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[160px] max-h-[220px] overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Query Output Dataset
              </span>

              {resultTable && resultTable.columns.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        {resultTable.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 font-semibold">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {resultTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((val: any, cIdx: number) => (
                            <td key={cIdx} className="px-3 py-2">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Run query to view output results.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
