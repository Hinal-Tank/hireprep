import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parseDsaQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'Coding_DSA_Problem_Statements_With_Data(1).md');
  if (!fs.existsSync(filePath)) {
    console.warn('Coding_DSA_Problem_Statements_With_Data(1).md not found at', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Split by "## " which delineates problem items
  const chunks = content.split(/^##\s+/m);
  const questions: Question[] = [];

  let qIndex = 1;

  for (const rawChunk of chunks) {
    if (!rawChunk.trim() || rawChunk.startsWith('#')) continue;

    const lines = rawChunk.split('\n');
    const headerLine = lines[0].trim(); // e.g. "1. Variables & Data Types" or "25. Merge Two Sorted Lists"
    const title = headerLine.replace(/^\d+[\.\:]\s*/, '').replace(/^Problem\s+\d+[\.\:]\s*/i, '').trim();

    if (!title) continue;

    const body = lines.slice(1).join('\n');

    // Extract sub-sections using regex
    const probStmtMatch = body.match(/###\s+Problem Statement\s*([\s\S]*?)(?=###|$)/i);
    const inputMatch = body.match(/###\s+Input\s*([\s\S]*?)(?=###|$)/i);
    const outputMatch = body.match(/###\s+Output\s*([\s\S]*?)(?=###|$)/i);
    const constraintsMatch = body.match(/###\s+Constraints\s*([\s\S]*?)(?=###|$)/i);

    // Extract sample inputs / outputs
    const sampleInputMatches = Array.from(body.matchAll(/###\s+Sample Input\s*\d*\s*```[a-z]*\n([\s\S]*?)```/gi));
    const sampleOutputMatches = Array.from(body.matchAll(/###\s+Sample Output\s*\d*\s*```[a-z]*\n([\s\S]*?)```/gi));

    const testCases: Array<{ input: string; expectedOutput: string }> = [];

    if (sampleInputMatches.length > 0 && sampleOutputMatches.length > 0) {
      for (let i = 0; i < Math.min(sampleInputMatches.length, sampleOutputMatches.length); i++) {
        testCases.push({
          input: sampleInputMatches[i][1].trim(),
          expectedOutput: sampleOutputMatches[i][1].trim(),
        });
      }
    }

    if (testCases.length === 0) {
      testCases.push({
        input: 'Sample Input',
        expectedOutput: 'Sample Output',
      });
    }

    const probStatementText = probStmtMatch ? probStmtMatch[1].trim() : body.trim();
    const inputDesc = inputMatch ? inputMatch[1].trim() : '';
    const outputDesc = outputMatch ? outputMatch[1].trim() : '';
    const constraints = constraintsMatch ? constraintsMatch[1].trim() : '1 <= N <= 10^5';

    // Clean starter code matching user guidelines
    let pythonStarter = `# Write your solution here\n`;
    if (/class\b/i.test(title) || /cache|data structure/i.test(title)) {
      pythonStarter = `class Solution:\n    def __init__(self):\n        # Write your solution here\n        pass\n`;
    }

    const starterCode = {
      python: pythonStarter,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
      c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n`,
    };

    const id = `DSA-CODE-${qIndex++}`;

    questions.push({
      id,
      categoryId: 'cat-dsa',
      categoryName: 'DSA / Coding',
      type: 'coding',
      title: title,
      description: probStatementText,
      createdAt: new Date().toISOString(),
      codingData: {
        supportedLanguages: ['python', 'cpp', 'c', 'java'],
        starterCode,
        inputDescription: inputDesc,
        outputDescription: outputDesc,
        constraints,
        examples: testCases.map((tc) => ({ input: tc.input, output: tc.expectedOutput })),
        testCases,
      },
    });
  }

  console.log(`Parsed ${questions.length} DSA coding problems from Coding_DSA_Problem_Statements_With_Data(1).md`);
  return questions;
}
