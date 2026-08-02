import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function answerToIndex(answer: string): number {
  switch (answer.trim().toUpperCase()) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    default:
      return -1;
  }
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

/**
 * Parse one-line C++ options.
 *
 * Example:
 *
 * A) First  B) Second  C) Third  D) Fourth
 *
 * Also supports:
 *
 * A. First  B. Second  C. Third  D. Fourth
 */
function parseInlineOptions(line: string): string[] {
  const cleaned = cleanMarkdown(line);

  const regex =
    /(?:^|\s)([A-D])[\.\)]\s*(.*?)(?=\s+[A-D][\.\)]\s*|$)/gi;

  const matches = [...cleaned.matchAll(regex)];

  if (matches.length !== 4) {
    return [];
  }

  const options: string[] = [];

  for (const match of matches) {
    const letter = match[1].toUpperCase();
    const text = match[2].trim();

    options.push(`${letter}) ${text}`);
  }

  return options;
}

export function parseCppQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'CPP_QUESTION_BANK.md');

  if (!fs.existsSync(filePath)) {
    console.warn(`CPP_QUESTION_BANK.md not found at: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const questions: Question[] = [];

  let currentSection = 'Fundamentals';
  let currentQuestionNumber: number | null = null;
  let currentQuestion = '';
  let currentOptions: string[] = [];
  let currentAnswer = -1;

  function resetQuestion() {
    currentQuestionNumber = null;
    currentQuestion = '';
    currentOptions = [];
    currentAnswer = -1;
  }

  function saveQuestion() {
    if (currentQuestionNumber === null || !currentQuestion) {
      resetQuestion();
      return;
    }

    if (
      currentOptions.length !== 4 ||
      currentOptions.some(option => !option) ||
      currentAnswer < 0 ||
      currentAnswer > 3
    ) {
      console.warn(
        `Skipping C++ question because the answer/options are missing or invalid:\n${currentQuestion}`
      );

      resetQuestion();
      return;
    }

    questions.push({
      id: `cpp-mcq-${currentQuestionNumber}-${questions.length + 1}`,
      categoryId: 'cat-cpp',
      categoryName: 'C++',
      type: 'mcq',
      title: currentQuestion,
      description: currentQuestion,
      createdAt: new Date().toISOString(),

      mcqData: {
        options: currentOptions,
        correctAnswer: currentAnswer,
        explanation:
          `Correct answer: ${OPTION_LETTERS[currentAnswer]}. ` +
          currentOptions[currentAnswer],
      },
    });

    resetQuestion();
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    /*
     * Section:
     *
     * ## 1. Fundamentals
     * ### Fundamentals
     */
    if (line.startsWith('## ') || line.startsWith('### ')) {
      saveQuestion();

      currentSection = cleanMarkdown(
        line
          .replace(/^###?\s*/, '')
          .replace(/^\d+\.\s*/, '')
      );

      continue;
    }

    /*
     * Question:
     *
     * **1. What is C++?**
     *
     * Also supports:
     *
     * 1. What is C++?
     * Q1. What is C++?
     */
    const questionMatch = line.match(
      /^\*{0,2}(?:Q)?(\d+)\.\s+(.+?)\*{0,2}$/
    );

    if (questionMatch) {
      saveQuestion();

      currentQuestionNumber = Number(questionMatch[1]);
      currentQuestion = cleanMarkdown(questionMatch[2]);

      continue;
    }

    /*
     * Answer:
     *
     * **Answer:** A
     *
     * This is the important format used by your
     * C++ Markdown file.
     */
    const answerMatch = line.match(
      /^\*{0,2}Answer:\*{0,2}\s*([A-D])(?:[\.\)])?\s*$/i
    );

    if (answerMatch) {
      currentAnswer = answerToIndex(answerMatch[1]);
      continue;
    }

    if (currentQuestionNumber === null) {
      continue;
    }

    /*
     * First try one-line options:
     *
     * A) First  B) Second  C) Third  D) Fourth
     */
    const inlineOptions = parseInlineOptions(line);

    if (inlineOptions.length === 4) {
      currentOptions = inlineOptions;
      continue;
    }

    /*
     * Then try normal options:
     *
     * A) First
     * B) Second
     * C) Third
     * D) Fourth
     *
     * or:
     *
     * A. First
     * B. Second
     */
    const optionMatch = line.match(
      /^([A-D])[\.\)]\s*(.+)$/i
    );

    if (optionMatch) {
      const letter = optionMatch[1].toUpperCase();
      const text = cleanMarkdown(optionMatch[2]);

      const index = answerToIndex(letter);

      if (index !== -1) {
        currentOptions[index] = `${letter}) ${text}`;
      }

      continue;
    }
  }

  /*
   * Save last question.
   */
  saveQuestion();

  console.log(
    `Parsed ${questions.length} C++ MCQs from CPP_QUESTION_BANK.md`
  );

  return questions;
}