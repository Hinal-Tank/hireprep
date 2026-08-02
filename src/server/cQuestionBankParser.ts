import fs from "fs";
import path from "path";
import { Question } from "../types.js";

export function parseCQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), "C_QUESTION_BANK.md");

  if (!fs.existsSync(filePath)) {
    console.warn("C_QUESTION_BANK.md not found:", filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  const questions: Question[] = [];

  let currentSection = "";
  let inMcqSection = false;

  let questionNo: number | null = null;
  let question = "";
  let options: string[] = [];
  let answer = -1;

  function saveQuestion() {
    if (
      questionNo !== null &&
      question &&
      options.length === 4 &&
      answer !== -1
    ) {
      const slug = currentSection
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      questions.push({
        id: `C-MCQ-${slug}-${questionNo}`,
        categoryId: "cat-c",
        categoryName: "C",
        type: "mcq",
        title: `C ${currentSection}: Q${questionNo}`,
        description: question,
        createdAt: new Date().toISOString(),

        mcqData: {
          options,
          correctAnswer: answer,
          explanation: `Correct Answer: ${["A", "B", "C", "D"][answer]}`
        }
      });
    }

    questionNo = null;
    question = "";
    options = [];
    answer = -1;
  }

  for (const raw of lines) {
    const line = raw.trim();

    // Section
    if (line.startsWith("## ")) {
      saveQuestion();
      currentSection = line.replace(/^##\s*\d+\.\s*/, "");
      continue;
    }

    // Start MCQ section
    if (line === "### MCQs") {
      inMcqSection = true;
      continue;
    }

    // Stop MCQ section
    if (line === "### Question & Answer") {
      saveQuestion();
      inMcqSection = false;
      continue;
    }

    if (!inMcqSection) continue;

    // Question
    const qMatch = line.match(/^\*\*(\d+)\.\s*(.*?)\*\*$/);

    if (qMatch) {
      saveQuestion();
      questionNo = Number(qMatch[1]);
      question = qMatch[2];
      continue;
    }

    // Options
    if (questionNo !== null && line.startsWith("A)")) {
      const matches = line.match(/[A-D]\)\s.*?(?=\s+[A-D]\)|$)/g);

      if (matches) {
        options = matches.map((m) => m.trim());
      }

      continue;
    }

    // Answer
    const ansMatch = line.match(/^\*\*Answer:\*\*\s*([A-D])/);

    if (ansMatch) {
      answer = ["A", "B", "C", "D"].indexOf(ansMatch[1]);
      continue;
    }
  }

  saveQuestion();

  console.log(`Parsed ${questions.length} C MCQs`);

  return questions;
}