import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parseSqlMcqBank(): Question[] {
  const fileCandidates = [
    'SQL_Comprehensive_MCQ_QA_Bank.md',
    'SQL_Comprehensive_MCQ_QA_Bank(2).md',
  ];

  let content = '';
  let foundPath = '';
  for (const f of fileCandidates) {
    const full = path.join(process.cwd(), f);
    if (fs.existsSync(full)) {
      content = fs.readFileSync(full, 'utf-8');
      foundPath = f;
      break;
    }
  }

  if (!content) {
    console.warn('SQL MCQ bank file not found in candidates:', fileCandidates);
    return [];
  }

  const lines = content.split('\n');
  const questions: Question[] = [];

  let currentTopic = 'SQL Fundamentals';
  let inMcq = false;

  let currentQNum: number | null = null;
  let currentQuestionText = '';
  let currentOptions: string[] = [];
  let currentAnswerIdx = -1;

  function finalizeMcq() {
    if (currentQuestionText && currentOptions.length >= 4 && currentAnswerIdx !== -1) {
      const topicSlug = currentTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const qNumStr = currentQNum ? currentQNum : questions.length + 1;
      const id = `SQL-MCQ-${topicSlug}-${qNumStr}`;

      questions.push({
        id,
        categoryId: 'cat-sql',
        categoryName: 'SQL',
        type: 'mcq',
        title: `SQL (${currentTopic}): Q${qNumStr}`,
        description: currentQuestionText,
        createdAt: new Date().toISOString(),
        mcqData: {
          options: currentOptions,
          correctAnswer: currentAnswerIdx,
          explanation: `Correct Answer is ${['A', 'B', 'C', 'D'][currentAnswerIdx]}: ${currentOptions[currentAnswerIdx] || ''}`,
        },
      });
    }

    currentQNum = null;
    currentQuestionText = '';
    currentOptions = [];
    currentAnswerIdx = -1;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ')) {
      finalizeMcq();
      currentTopic = line.replace('## ', '').trim();
      inMcq = false;
      continue;
    }

    if (line.startsWith('### MCQs')) {
      finalizeMcq();
      inMcq = true;
      continue;
    }

    if (line.startsWith('### Question & Answer')) {
      finalizeMcq();
      inMcq = false;
      continue;
    }

    if (inMcq) {
      const qMatch = line.match(/^\*\*(\d+)\.\s+(.+)$/);
      if (qMatch) {
        finalizeMcq();
        currentQNum = parseInt(qMatch[1], 10);
        let qText = qMatch[2].replace(/\*\*/g, '').trim();
        currentQuestionText = qText;
        continue;
      }

      const optMatchA = line.match(/^A\)\s+(.+?)\s+B\)\s+(.+?)\s+C\)\s+(.+?)\s+D\)\s+(.+)$/);
      if (optMatchA) {
        currentOptions = [
          `A) ${optMatchA[1]}`,
          `B) ${optMatchA[2]}`,
          `C) ${optMatchA[3]}`,
          `D) ${optMatchA[4]}`,
        ];
        continue;
      }

      const singleOptMatch = line.match(/^([A-D])\)\s+(.+)$/);
      if (singleOptMatch && currentQNum !== null) {
        currentOptions.push(line);
        continue;
      }

      const ansMatch = line.match(/^\*\*Answer\:\*\*\s*([A-D])/i);
      if (ansMatch && currentQNum !== null) {
        const letter = ansMatch[1].toUpperCase();
        currentAnswerIdx = letter === 'A' ? 0 : letter === 'B' ? 1 : letter === 'C' ? 2 : 3;
        continue;
      }
    }
  }

  finalizeMcq();

  console.log(`Parsed ${questions.length} SQL MCQs from ${foundPath}`);
  return questions;
}
