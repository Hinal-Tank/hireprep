import initSqlJs from 'sql.js';
import { Question, SubmissionStatus } from '../types.js';

let SQL: any = null;

async function getSqlEngine() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

export async function evaluateMCQ(
  question: Question,
  selectedIndex: number
): Promise<{ status: SubmissionStatus; score: number; explanation: string; isCorrect: boolean }> {
  if (!question.mcqData) {
    throw new Error('Question lacks MCQ data');
  }

  const isCorrect = selectedIndex === question.mcqData.correctAnswer;
  const score = isCorrect ? 10 : 0;
  const status: SubmissionStatus = isCorrect ? 'correct' : 'incorrect';

  return {
    status,
    score,
    explanation: question.mcqData.explanation,
    isCorrect,
  };
}

export async function evaluateSQLQuery(
  question: Question,
  userQuery: string
): Promise<{
  status: SubmissionStatus;
  score: number;
  columns: string[];
  rows: any[][];
  feedback: string;
}> {
  if (!question.sqlData) {
    throw new Error('Question lacks SQL data');
  }

  const sqlEngine = await getSqlEngine();
  const db = new sqlEngine.Database();

  try {
    // 1. Execute schema creation
    db.run(question.sqlData.schema);

    // 2. Insert sample data if available
    if (question.sqlData.sampleData) {
      db.run(question.sqlData.sampleData);
    }

    // 3. Execute expected query to obtain expected results
    let expectedRes: { columns: string[]; values: any[][] }[] = [];
    try {
      expectedRes = db.exec(question.sqlData.correctQuery);
    } catch (e) {
      console.error('Error executing expected query:', e);
    }

    // 4. Execute user query
    const userRes = db.exec(userQuery);

    if (!userRes || userRes.length === 0) {
      return {
        status: 'incorrect',
        score: 0,
        columns: [],
        rows: [],
        feedback: 'Query executed but produced no results or error in table generation.',
      };
    }

    const columns = userRes[0].columns;
    const rows = userRes[0].values;

    // Compare with expected results
    let isCorrect = false;
    if (expectedRes.length > 0 && userRes.length > 0) {
      const expCols = expectedRes[0].columns;
      const expRows = expectedRes[0].values;

      const sameCols = JSON.stringify(columns.map((c) => c.toLowerCase())) === JSON.stringify(expCols.map((c) => c.toLowerCase()));
      const sameRows = JSON.stringify(rows) === JSON.stringify(expRows);

      if (sameCols && sameRows) {
        isCorrect = true;
      } else if (sameRows) {
        // Same values even if column names casing differs slightly
        isCorrect = true;
      }
    }

    const score = isCorrect ? 25 : 0;
    const status: SubmissionStatus = isCorrect ? 'correct' : 'incorrect';
    const feedback = isCorrect
      ? 'Query executed successfully and matched expected result!'
      : 'Query executed successfully, but output does not match expected result table.';

    return {
      status,
      score,
      columns,
      rows,
      feedback,
    };
  } catch (err: any) {
    return {
      status: 'error',
      score: 0,
      columns: [],
      rows: [],
      feedback: `SQL Error: ${err.message || err}`,
    };
  } finally {
    db.close();
  }
}

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function evaluateCodeSubmission(
  question: Question,
  code: string,
  language: string
): Promise<{
  status: SubmissionStatus;
  score: number;
  feedback: string;
  testCaseResults: Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }>;
}> {
  if (!question.codingData || !question.codingData.testCases) {
    throw new Error('Question lacks coding test cases');
  }

  const titleLower = (question.title || '').toLowerCase();
  const constraintsLower = (question.codingData?.constraints || '').toLowerCase();

  // 1. Constraint Check
  if (
    titleLower.includes('without using the print') ||
    titleLower.includes('without using print') ||
    constraintsLower.includes('without using the print') ||
    constraintsLower.includes('without using print')
  ) {
    // Strip comments before checking for print()
    const codeWithoutComments = code.replace(/#.*$/gm, '');
    if (/\bprint\s*\(/.test(codeWithoutComments)) {
      const tc = question.codingData.testCases[0] || { input: 'None', expectedOutput: 'Hello World' };
      return {
        status: 'rejected',
        score: 0,
        feedback: 'Constraint violation: You used print(), but the problem explicitly forbids print()!',
        testCaseResults: [
          {
            passed: false,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: 'Error: Constraint Violation (Banned print() function used)',
            error: 'Constraint violation: The print() function is forbidden for this problem.',
          },
        ],
      };
    }
  }

  if (titleLower.includes('without using max()') || constraintsLower.includes('without using max')) {
    const codeWithoutComments = code.replace(/#.*$/gm, '');
    if (/\bmax\s*\(/.test(codeWithoutComments)) {
      const tc = question.codingData.testCases[0] || { input: '', expectedOutput: '' };
      return {
        status: 'rejected',
        score: 0,
        feedback: 'Constraint violation: You used max(), but the problem explicitly forbids max()!',
        testCaseResults: [
          {
            passed: false,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: 'Error: Constraint Violation (Banned max() function used)',
            error: 'Constraint violation: Do not use built-in max().',
          },
        ],
      };
    }
  }

  if (titleLower.includes('without using **') || constraintsLower.includes('without using **')) {
    const codeWithoutComments = code.replace(/#.*$/gm, '');
    if (codeWithoutComments.includes('**')) {
      const tc = question.codingData.testCases[0] || { input: '', expectedOutput: '' };
      return {
        status: 'rejected',
        score: 0,
        feedback: 'Constraint violation: You used ** operator, but the problem explicitly forbids **!',
        testCaseResults: [
          {
            passed: false,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: 'Error: Constraint Violation (Banned ** operator used)',
            error: 'Constraint violation: Do not use ** operator.',
          },
        ],
      };
    }
  }

  const testCases = question.codingData.testCases;
  const results: Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }> = [];

  let totalPassed = 0;

  for (const tc of testCases) {
    let passed = false;
    let actual = '';
    let error: string | undefined = undefined;

    try {
      actual = runCodeAgainstInput(code, language, tc.input, question);
      const normActual = normalizeOutput(actual);
      const normExp = normalizeOutput(tc.expectedOutput);

      const hasExecutionError =
        actual.toLowerCase().startsWith('error') ||
        actual.includes('SyntaxError') ||
        actual.includes('NameError') ||
        actual.includes('TypeError') ||
        actual.includes('IndentationError') ||
        actual.includes('Traceback') ||
        actual.includes('Exception');

      if (hasExecutionError) {
        passed = false;
      } else {
        passed = normActual === normExp;
      }
    } catch (e: any) {
      error = e.message || String(e);
      actual = `Error: ${error}`;
      passed = false;
    }

    if (passed) totalPassed++;

    results.push({
      passed,
      input: tc.input,
      expected: tc.expectedOutput,
      actual,
      error,
    });
  }

  const allPassed = totalPassed === testCases.length;
  const score = allPassed ? 25 : Math.round((totalPassed / testCases.length) * 15);
  const status: SubmissionStatus = allPassed ? 'accepted' : 'rejected';
  const feedback = allPassed
    ? `All ${testCases.length} test cases passed!`
    : `Passed ${totalPassed}/${testCases.length} test cases. Actual output did not match expected output.`;

  return {
    status,
    score,
    feedback,
    testCaseResults: results,
  };
}

function normalizeOutput(str: string): string {
  if (!str) return '';
  return str.toString().trim().toLowerCase().replace(/\s+/g, ' ').replace(/['"]/g, '');
}

function runCodeAgainstInput(code: string, language: string, inputStr: string, question: Question): string {
  if (language === 'python') {
    return runPythonCodeReal(code, inputStr);
  }

  // Fallback for non-python or standard evaluator
  return runPythonCodeReal(code, inputStr);
}

function runPythonCodeReal(code: string, inputStr: string): string {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `py_exec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.py`);

  const runner = `import sys
import io

input_data = ${JSON.stringify(inputStr || '')}
if input_data.strip() and input_data != 'None':
    sys.stdin = io.StringIO(input_data)

${code}

if __name__ == '__main__':
    if 'solve' in globals() and callable(globals()['solve']):
        try:
            import inspect
            sig = inspect.signature(globals()['solve'])
            if len(sig.parameters) == 0:
                res = globals()['solve']()
                if res is not None:
                    print(res)
            else:
                lines = [x.strip() for x in input_data.split(',') if x.strip()]
                parsed = []
                for l in lines[:len(sig.parameters)]:
                    try:
                        parsed.append(eval(l))
                    except:
                        parsed.append(l)
                res = globals()['solve'](*parsed)
                if res is not None:
                    print(res)
        except Exception as e:
            sys.stderr.write(str(e))
`;

  try {
    fs.writeFileSync(tmpFile, runner, 'utf-8');
    const stdout = execSync(`python3 "${tmpFile}"`, {
      timeout: 3000,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
  } catch (err: any) {
    const stderr = err.stderr ? err.stderr.toString() : err.message || 'Execution error';
    const stdout = err.stdout ? err.stdout.toString() : '';
    if (stdout.trim()) return stdout.trim();
    return `Error: ${stderr.trim()}`;
  } finally {
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch (_) {}
  }
}
