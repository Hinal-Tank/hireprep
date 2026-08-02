import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parsePythonQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'PYTHON_QUESTION_BANK.md');
  if (!fs.existsSync(filePath)) {
    console.warn('PYTHON_QUESTION_BANK.md not found at', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const questions: Question[] = [];

  let currentSection = '';
  let inMcqSection = false;
  let inCodingSection = false;

  let currentMcqNum: number | null = null;
  let currentMcqQuestion = '';
  let currentMcqOptions: string[] = [];
  let currentMcqAnswer = -1;

  function finalizeMcq() {
    if (currentMcqQuestion && currentMcqOptions.length >= 4 && currentMcqAnswer !== -1) {
      const secSlug = currentSection ? currentSection.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general';
      const id = `PY-MCQ-${secSlug}-${currentMcqNum}`;
      questions.push({
        id,
        categoryId: 'cat-python',
        categoryName: 'Python',
        type: 'mcq',
        title: `Python ${currentSection || 'Fundamentals'}: Q${currentMcqNum}`,
        description: currentMcqQuestion,
        createdAt: new Date().toISOString(),
        mcqData: {
          options: currentMcqOptions,
          correctAnswer: currentMcqAnswer,
          explanation: `Correct Answer is ${['A', 'B', 'C', 'D'][currentMcqAnswer]}: ${currentMcqOptions[currentMcqAnswer] || ''}`
        }
      });
    }
    currentMcqNum = null;
    currentMcqQuestion = '';
    currentMcqOptions = [];
    currentMcqAnswer = -1;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## 100 Python Coding Interview Questions')) {
      finalizeMcq();
      inCodingSection = true;
      inMcqSection = false;
      continue;
    }

    if (line.startsWith('## ') && !inCodingSection) {
      finalizeMcq();
      currentSection = line.replace('## ', '').trim();
      inMcqSection = false;
      continue;
    }

    if (line.startsWith('### MCQs')) {
      finalizeMcq();
      inMcqSection = true;
      continue;
    }

    if (line.startsWith('### Question & Answer')) {
      finalizeMcq();
      inMcqSection = false;
      continue;
    }

    if (inMcqSection) {
      const qMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (qMatch) {
        finalizeMcq();
        currentMcqNum = parseInt(qMatch[1], 10);
        currentMcqQuestion = qMatch[2];
        continue;
      }

      const optMatch = line.match(/^([A-D])\)\s+(.+)$/);
      if (optMatch && currentMcqNum !== null) {
        currentMcqOptions.push(line);
        continue;
      }

      const ansMatch = line.match(/^Answer:\s*([A-D])/i);
      if (ansMatch && currentMcqNum !== null) {
        const letter = ansMatch[1].toUpperCase();
        currentMcqAnswer = letter === 'A' ? 0 : letter === 'B' ? 1 : letter === 'C' ? 2 : 3;
        continue;
      }
    }

    if (inCodingSection) {
      const codeMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (codeMatch) {
        const qNum = parseInt(codeMatch[1], 10);
        const title = codeMatch[2].replace(/`/g, '');
        const id = `PY-CODE-${qNum}`;
        const meta = getCodingMetadata(qNum, title);

        questions.push({
          id,
          categoryId: 'cat-python',
          categoryName: 'Python',
          type: 'coding',
          title: `Python Problem ${qNum}: ${title}`,
          description: `Write a Python program or function to solve the following problem:\n\n**${title}**`,
          createdAt: new Date().toISOString(),
          codingData: {
            supportedLanguages: ['python'],
            starterCode: {
              python: meta.starterCode
            },
            inputDescription: meta.inputDescription,
            outputDescription: meta.outputDescription,
            constraints: meta.constraints,
            examples: meta.examples,
            testCases: meta.testCases
          }
        });
      }
    }
  }

  finalizeMcq();

  console.log(`Parsed ${questions.length} Python questions from PYTHON_QUESTION_BANK.md (${questions.filter(q => q.type === 'mcq').length} MCQs, ${questions.filter(q => q.type === 'coding').length} Coding)`);

  return questions;
}

function getCodingMetadata(qNum: number, title: string) {
  let input = '';
  let expectedOutput = '';
  let constraints = 'Standard execution time (2.0s)';
  let starterCode = `# Write your solution here\n`;

  if (/class\b/i.test(title) || qNum >= 86 && qNum <= 90 || qNum === 98) {
    starterCode = `class Solution:\n    def __init__(self):\n        # Write your solution here\n        pass\n`;
  }

  if (qNum === 1) {
    input = 'None';
    expectedOutput = 'Hello World';
    constraints = 'Constraint: Do NOT use the built-in print() function. Use sys.stdout.write().';
    starterCode = `import sys\n# Write your solution here using sys.stdout.write()\n`;
  } else if (qNum === 2) {
    input = '10, 25, 15';
    expectedOutput = '25';
    constraints = 'Constraint: Do NOT use built-in max() function.';
  } else if (qNum === 3) {
    input = '7';
    expectedOutput = 'Odd';
  } else if (qNum === 4) {
    input = '29';
    expectedOutput = 'Prime';
  } else if (qNum === 5) {
    input = '5';
    expectedOutput = '120';
  } else if (qNum === 6) {
    input = '5';
    expectedOutput = '0 1 1 2 3';
  } else if (qNum === 7) {
    input = '12345';
    expectedOutput = '54321';
  } else if (qNum === 8) {
    input = '121';
    expectedOutput = 'True';
  } else if (qNum === 9) {
    input = '987654';
    expectedOutput = '6';
  } else if (qNum === 10) {
    input = '1234';
    expectedOutput = '10';
  } else if (qNum === 11) {
    input = '12, 18';
    expectedOutput = '6';
  } else if (qNum === 12) {
    input = '12, 18';
    expectedOutput = '36';
  } else if (qNum === 13) {
    input = 'a=5, b=10';
    expectedOutput = 'a=10, b=5';
    constraints = 'Constraint: Do NOT use a third variable.';
  } else if (qNum === 14) {
    input = '2024';
    expectedOutput = 'True';
  } else if (qNum === 15) {
    input = '2, 5';
    expectedOutput = '32';
    constraints = 'Constraint: Do NOT use ** operator.';
  } else if (qNum === 16) {
    input = '500';
    expectedOutput = '153 370 371 407';
  } else if (qNum === 17) {
    input = '48291';
    expectedOutput = '9';
  } else if (qNum === 18) {
    input = '5';
    expectedOutput = '5 10 15 20 25 30 35 40 45 50';
  } else if (qNum === 19) {
    input = '28';
    expectedOutput = 'True';
  } else if (qNum === 20) {
    input = '10';
    expectedOutput = '55';
  } else if (qNum === 21) {
    input = 'hello';
    expectedOutput = 'olleh';
  } else if (qNum === 22) {
    input = 'racecar';
    expectedOutput = 'True';
  } else if (qNum === 23) {
    input = 'hello world';
    expectedOutput = '3 7';
  } else if (qNum === 24) {
    input = 'programming';
    expectedOutput = 'r g m';
  } else if (qNum === 25) {
    input = 'hello world python';
    expectedOutput = 'helloworldpython';
  } else if (qNum === 26) {
    input = 'aba';
    expectedOutput = 'a: 2, b: 1';
  } else if (qNum === 27) {
    input = 'listen, silent';
    expectedOutput = 'True';
  } else if (qNum === 28) {
    input = 'swiss';
    expectedOutput = 'w';
  } else if (qNum === 29) {
    input = 'hello world';
    expectedOutput = 'hello%20world';
  } else if (qNum === 30) {
    input = 'Python is programming';
    expectedOutput = 'programming';
  } else if (qNum === 31) {
    input = 'hello world python';
    expectedOutput = 'Hello World Python';
  } else if (qNum === 32) {
    input = 'banana';
    expectedOutput = 'ban';
  } else if (qNum === 33) {
    input = 'waterbottle, erbottlewat';
    expectedOutput = 'True';
  } else if (qNum === 34) {
    input = 'aaabbcc';
    expectedOutput = 'a3b2c2';
  } else if (qNum === 35) {
    input = 'babad';
    expectedOutput = 'bab';
  } else if (qNum === 36) {
    input = 'abc';
    expectedOutput = 'a ab abc b bc c';
  } else if (qNum === 37) {
    input = 'Python is easy to learn';
    expectedOutput = '5';
  } else if (qNum === 38) {
    input = 'hello world python';
    expectedOutput = 'python world hello';
  } else if (qNum === 39) {
    input = '123456';
    expectedOutput = 'True';
  } else if (qNum === 40) {
    input = 'test string';
    expectedOutput = 't';
  } else if (qNum === 41) {
    input = '[3, 1, 9, 4, 7]';
    expectedOutput = 'Max: 9, Min: 1';
  } else if (qNum === 42) {
    input = '[10, 20, 4, 45, 99]';
    expectedOutput = '45';
  } else if (qNum === 43) {
    input = '[1, 2, 2, 3, 4, 4, 5]';
    expectedOutput = '[1, 2, 3, 4, 5]';
  } else if (qNum === 44) {
    input = '[1, 3, 5], [2, 4, 6]';
    expectedOutput = '[1, 2, 3, 4, 5, 6]';
  } else if (qNum === 45) {
    input = '[1, 2, 3, 4, 5], 2';
    expectedOutput = '[4, 5, 1, 2, 3]';
  } else if (qNum === 46) {
    input = '[1, 2, 4, 5, 6]';
    expectedOutput = '3';
  } else if (qNum === 47) {
    input = '[1, 2, 3, 4], [3, 4, 5, 6]';
    expectedOutput = '[3, 4]';
  } else if (qNum === 48) {
    input = '[1, 2, 3], [3, 4, 5]';
    expectedOutput = '[1, 2, 3, 4, 5]';
  } else if (qNum === 49) {
    input = '[0, 1, 0, 3, 12]';
    expectedOutput = '[1, 3, 12, 0, 0]';
  } else if (qNum === 50) {
    input = '[1, 2, 3, 4, 5, 6]';
    expectedOutput = 'Evens: [2, 4, 6], Odds: [1, 3, 5]';
  } else if (qNum === 51) {
    input = '[1, 1, 2, 3, 3, 3]';
    expectedOutput = '1: 2, 2: 1, 3: 3';
  } else if (qNum === 52) {
    input = '[5, 2, 8, 1, 9]';
    expectedOutput = '[1, 2, 5, 8, 9]';
    constraints = 'Constraint: Do NOT use sort() or sorted().';
  } else if (qNum === 53) {
    input = '[3, 2, 1, 5, 6, 4], 2';
    expectedOutput = '5';
  } else if (qNum === 54) {
    input = '[1, 5, 7, -1, 5], 6';
    expectedOutput = '(1, 5), (7, -1)';
  } else if (qNum === 55) {
    input = '[1, 2, 3, 4, 5]';
    expectedOutput = 'True';
  } else if (qNum === 56) {
    input = '[1, 2, 3, 4, 5]';
    expectedOutput = '[5, 4, 3, 2, 1]';
    constraints = 'Constraint: Do NOT use list slicing [::-1].';
  } else if (qNum === 57) {
    input = '[3, 3, 4, 2, 4, 4, 2, 4, 4]';
    expectedOutput = '4';
  } else if (qNum === 58) {
    input = '[1, 2, 3, 2, 4, 5, 1]';
    expectedOutput = '[1, 2]';
  } else if (qNum === 59) {
    input = '[3, 2, 2, 3], 3';
    expectedOutput = '[2, 2]';
  } else if (qNum === 60) {
    input = '[100, 4, 200, 1, 3, 2]';
    expectedOutput = '4';
  } else if (qNum === 61) {
    input = 'apple banana apple cherry apple banana';
    expectedOutput = "apple: 3, banana: 2, cherry: 1";
  } else if (qNum === 62) {
    input = "{'a': 1, 'b': 2}";
    expectedOutput = "{1: 'a', 2: 'b'}";
  } else if (qNum === 63) {
    input = "{'a': 1}, {'b': 2}";
    expectedOutput = "{'a': 1, 'b': 2}";
  } else if (qNum === 64) {
    input = "{'a': 1, 'b': 2}, {'b': 3, 'c': 4}";
    expectedOutput = "['b']";
  } else if (qNum === 65) {
    input = "{'a': 3, 'b': 1, 'c': 2}";
    expectedOutput = "{'b': 1, 'c': 2, 'a': 3}";
  } else if (qNum === 66) {
    input = "{'a': 10, 'b': 50, 'c': 25}";
    expectedOutput = 'b';
  } else if (qNum === 67) {
    input = "{'a': 1, 'b': 2, 'c': 1}";
    expectedOutput = "{'a': 1, 'b': 2}";
  } else if (qNum === 68) {
    input = 'apple ape banana ball cat';
    expectedOutput = "a: ['apple', 'ape'], b: ['banana', 'ball'], c: ['cat']";
  } else if (qNum === 69) {
    input = 'hello';
    expectedOutput = "{'h': 1, 'e': 1, 'l': 2, 'o': 1}";
  } else if (qNum === 70) {
    input = "{'a': 1, 'b': 2}, {'b': 2, 'a': 1}";
    expectedOutput = 'True';
  } else if (qNum === 71) {
    input = '5';
    expectedOutput = '120';
  } else if (qNum === 72) {
    input = '6';
    expectedOutput = '8';
  } else if (qNum === 73) {
    input = '48, 18';
    expectedOutput = '6';
  } else if (qNum === 74) {
    input = '3';
    expectedOutput = '7';
  } else if (qNum === 75) {
    input = 'python';
    expectedOutput = 'nohtyp';
  } else if (qNum === 76) {
    input = '1234';
    expectedOutput = '10';
  } else if (qNum === 77) {
    input = '98765';
    expectedOutput = '5';
  } else if (qNum === 78) {
    input = '2, 4';
    expectedOutput = '16';
  } else if (qNum === 79) {
    input = '[1, 3, 5, 7, 9], 7';
    expectedOutput = '3';
  } else if (qNum === 80) {
    input = 'madam';
    expectedOutput = 'True';
  } else if (qNum === 81) {
    input = 'line1\\nline2\\nline3';
    expectedOutput = '3';
  } else if (qNum === 82) {
    input = 'hello world from python';
    expectedOutput = '4';
  } else if (qNum === 83) {
    input = 'education';
    expectedOutput = '5';
  } else if (qNum === 84) {
    input = 'sample text';
    expectedOutput = 'sample text';
  } else if (qNum === 85) {
    input = 'the quick brown fox jumps over the lazy dog';
    expectedOutput = 'quick';
  } else if (qNum === 86) {
    input = 'Alice, 20';
    expectedOutput = 'Student: Alice, Age: 20';
  } else if (qNum === 87) {
    input = 'John, Tech Lead';
    expectedOutput = 'Employee: John, Role: Tech Lead';
  } else if (qNum === 88) {
    input = 'Dog';
    expectedOutput = 'Woof!';
  } else if (qNum === 89) {
    input = 'Deposit 100, Withdraw 30';
    expectedOutput = 'Balance: 70';
  } else if (qNum === 90) {
    input = 'Secret';
    expectedOutput = 'Private value accessed securely';
  } else if (qNum === 91) {
    input = '[2, 7, 11, 15], 9';
    expectedOutput = '[0, 1]';
  } else if (qNum === 92) {
    input = '["flower", "flow", "flight"]';
    expectedOutput = '"fl"';
  } else if (qNum === 93) {
    input = '()[]{}';
    expectedOutput = 'True';
  } else if (qNum === 94) {
    input = '[[1,3],[2,6],[8,10],[15,18]]';
    expectedOutput = '[[1,6],[8,10],[15,18]]';
  } else if (qNum === 95) {
    input = '[3, 4, -1, 1]';
    expectedOutput = '2';
  } else if (qNum === 96) {
    input = 'abcabcbb';
    expectedOutput = '3';
  } else if (qNum === 97) {
    input = '[[1,2],[3,4]]';
    expectedOutput = '[[3,1],[4,2]]';
  } else if (qNum === 98) {
    input = 'Put(1,1), Put(2,2), Get(1)';
    expectedOutput = '1';
  } else if (qNum === 99) {
    input = '[1, 3], [2]';
    expectedOutput = '2.0';
  } else if (qNum === 100) {
    input = 'Add Book("Python 101")';
    expectedOutput = 'Book "Python 101" added.';
  } else {
    input = 'Sample Input';
    expectedOutput = 'Sample Output';
  }

  return {
    starterCode,
    constraints,
    inputDescription: `Input parameter or data: ${input}`,
    outputDescription: `Expected output format: ${expectedOutput}`,
    examples: [{ input, output: expectedOutput }],
    testCases: [{ input, expectedOutput }],
  };
}
