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

export function parseJavaQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'JAVA_QUESTION_BANK.md');

  if (!fs.existsSync(filePath)) {
    console.warn(`JAVA_QUESTION_BANK.md not found at: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const questions: Question[] = [];

  let currentSection = 'Java Fundamentals';
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
        `Skipping Java question because the answer/options are missing or invalid:\n${currentQuestion}`
      );

      resetQuestion();
      return;
    }

    questions.push({
      id: `java-mcq-${currentQuestionNumber}-${questions.length + 1}`,
      categoryId: 'cat-java',
      categoryName: 'Java',
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
     * Section headings
     *
     * ### Java Fundamentals
     */
    if (line.startsWith('### ')) {
      saveQuestion();

      currentSection = cleanMarkdown(
        line.replace(/^###\s*/, '').replace(/^\d+\.\s*/, '')
      );

      continue;
    }

    /*
     * Question
     *
     * **Q1. Which keyword is used to define a class in Java?**
     *
     * Also supports:
     * **1. Question**
     * Q1. Question
     * 1. Question
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
     * Answer
     *
     * IMPORTANT:
     * The actual Markdown format is:
     *
     * **Answer:** A
     *
     * NOT:
     *
     * **Answer**: A
     */
    const answerMatch = line.match(
      /^\*{0,2}Answer:\*{0,2}\s*([A-D])(?:[\.\)])?\s*$/i
    );

    if (answerMatch) {
      currentAnswer = answerToIndex(answerMatch[1]);
      continue;
    }

    /*
     * Options
     *
     * A. class
     * B. struct
     * C. define
     * D. type
     *
     * Also supports:
     *
     * A) class
     * B) struct
     */
    const optionMatch = line.match(
      /^([A-D])[\.\)]\s*(.+)$/i
    );

    if (optionMatch && currentQuestionNumber !== null) {
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
   * Save final question.
   */
  saveQuestion();

  console.log(
    `Parsed ${questions.length} Java MCQs from JAVA_QUESTION_BANK.md`
  );

  return questions;
}