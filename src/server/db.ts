import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Category,
  Question,
  Submission,
  StudyRoom,
  RoomMember,
  ChatMessage,
  RoomActivity,
  AdminStats,
  UserProgressStats,
} from '../types.js';
import { parsePythonQuestionBank } from './pythonQuestionBankParser.js';
import { parseCQuestionBank } from './cQuestionBankParser.js';
import { parseCppQuestionBank } from './cppQuestionBankParser.js';
import { parseJavaQuestionBank } from './javaQuestionBankParser.js';
import { parseDsaQuestionBank } from './dsaQuestionBankParser.js';
import { parseHrQuestionBank } from './hrQuestionBankParser.js';
import { parseSqlQueries } from './sqlQueriesParser.js';
import { parseSqlMcqBank } from './sqlMcqParser.js';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

interface DbSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> hashedPassword
  categories: Category[];
  questions: Question[];
  submissions: Submission[];
  studyRooms: StudyRoom[];
  roomMembers: RoomMember[];
  chatMessages: ChatMessage[];
  roomActivities: RoomActivity[];
}

// Initial seed categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-dsa', name: 'DSA', description: 'Master Data Structures & Algorithms concepts, problem solving, and efficiency.' },
  { id: 'cat-sql', name: 'SQL', description: 'Practice relational database queries, joins, aggregations, and optimizations.' },
  { id: 'cat-hr', name: 'HR Interview', description: 'Prepare for HR and behavioral interview questions with high-scoring answers and rating guides.' },
  { id: 'cat-python', name: 'Python', description: 'Solve core Python challenges, data manipulation, and clean coding practices.' },
  { id: 'cat-c', name: 'C', description: 'Master low-level C programming, pointers, memory allocation, and structs.' },
  { id: 'cat-cpp', name: 'C++', description: 'Practice object-oriented programming, STL containers, and modern C++ features.' },
  { id: 'cat-java', name: 'Java', description: 'Master Java OOP, collections framework, exception handling, and streams.' },
];

// Seed initial questions across categories
const INITIAL_QUESTIONS: Question[] = [
  // --- DSA ---
  {
    id: 'q-dsa-1',
    categoryId: 'cat-dsa',
    categoryName: 'DSA',
    type: 'coding',
    title: 'Two Sum Problem',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python', 'cpp', 'java', 'c'],
      starterCode: {
        python: 'def twoSum(nums, target):\n    # Write your code here\n    pass',
        cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}',
        java: 'import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
        c: '#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 0;\n    return NULL;\n}'
      },
      inputDescription: 'Array of numbers and target sum integer.',
      outputDescription: 'List of two 0-based indices.',
      constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' }
      ],
      testCases: [
        { input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0, 1]' },
        { input: 'nums=[3,2,4], target=6', expectedOutput: '[1, 2]' },
        { input: 'nums=[3,3], target=6', expectedOutput: '[0, 1]' }
      ]
    }
  },
  {
    id: 'q-dsa-2',
    categoryId: 'cat-dsa',
    categoryName: 'DSA',
    type: 'mcq',
    title: 'Time Complexity of Binary Search',
    description: 'What is the worst-case time complexity of Binary Search algorithm on a sorted array of size n?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
      correctAnswer: 2,
      explanation: 'Binary Search halves the search space in each step, resulting in a logarithmic time complexity of O(log n).'
    }
  },
  {
    id: 'q-dsa-3',
    categoryId: 'cat-dsa',
    categoryName: 'DSA',
    type: 'mcq',
    title: 'Data Structure for Breadth-First Search (BFS)',
    description: 'Which data structure is fundamentally used to implement Breadth-First Search (BFS) in a graph or tree?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
      correctAnswer: 1,
      explanation: 'BFS explores nodes level by level using a FIFO (First In First Out) Queue.'
    }
  },

  // --- PYTHON MCQs & CODING (From User Question Bank) ---
  // Section 1: Fundamentals
  {
    id: 'PY-001',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Function Definition Keyword',
    description: 'Which keyword is used to define a function in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) func', 'B) define', 'C) def', 'D) function'],
      correctAnswer: 2,
      explanation: 'In Python, functions are defined using the def keyword followed by the function name.'
    }
  },
  {
    id: 'PY-002',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Single Line Comment Symbol',
    description: 'Which symbol is used to start a single-line comment in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) //', 'B) #', 'C) /*', 'D) --'],
      correctAnswer: 1,
      explanation: 'Python uses the hash symbol # for single-line comments.'
    }
  },
  {
    id: 'PY-003',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Standard Output Function',
    description: 'Which built-in function displays output to the console in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) output()', 'B) display()', 'C) print()', 'D) show()'],
      correctAnswer: 2,
      explanation: 'The print() function sends formatted output to the standard output stream.'
    }
  },
  {
    id: 'PY-004',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python User Input Function',
    description: 'Which built-in function reads user input as a string in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) read()', 'B) input()', 'C) scan()', 'D) get()'],
      correctAnswer: 1,
      explanation: 'The input() function reads line input from standard input as a string.'
    }
  },
  {
    id: 'PY-005',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Language Paradigm',
    description: 'Python is primarily categorized as which type of programming language?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) compiled-only', 'B) interpreted/high-level', 'C) assembly', 'D) markup'],
      correctAnswer: 1,
      explanation: 'Python is a high-level, dynamically typed, interpreted programming language.'
    }
  },
  {
    id: 'PY-006',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Source File Extension',
    description: 'Which standard file extension is used for Python source code files?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) .java', 'B) .py', 'C) .python', 'D) .pt'],
      correctAnswer: 1,
      explanation: 'Python scripts use the .py file extension.'
    }
  },
  {
    id: 'PY-007',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Assignment Operator',
    description: 'Which statement correctly assigns the integer value 10 to variable x?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) x == 10', 'B) x := 10', 'C) x = 10', 'D) let x = 10'],
      correctAnswer: 2,
      explanation: 'The single equal sign = is Python\'s assignment operator.'
    }
  },
  {
    id: 'PY-008',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Code Block Structuring',
    description: 'What does indentation define in Python syntax?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) variable type', 'B) code blocks', 'C) comments', 'D) imports'],
      correctAnswer: 1,
      explanation: 'Indentation (whitespace) defines blocks of code for functions, loops, and conditionals.'
    }
  },
  {
    id: 'PY-009',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Valid Python Identifier',
    description: 'Which of the following is a valid Python variable name?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 2value', 'B) class', 'C) first_name', 'D) first-name'],
      correctAnswer: 2,
      explanation: 'Python identifiers must start with a letter or underscore, and cannot be reserved keywords or contain hyphens.'
    }
  },
  {
    id: 'PY-010',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Result of type(10)',
    description: 'What is returned by evaluating type(10) in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) float', 'B) int', 'C) number', 'D) integer'],
      correctAnswer: 1,
      explanation: 'In Python, whole numbers belong to the int class.'
    }
  },
  {
    id: 'PY-011',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Boolean Literal Syntax',
    description: 'Which is the correct Boolean true literal in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) true', 'B) TRUE', 'C) True', 'D) bool'],
      correctAnswer: 2,
      explanation: 'Python is case-sensitive; Boolean values are capitalized as True and False.'
    }
  },
  {
    id: 'PY-012',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Exponentiation Operator',
    description: 'Which operator is used for calculating exponents (power) in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) ^', 'B) **', 'C) //', 'D) ^^'],
      correctAnswer: 1,
      explanation: 'The ** operator raises a base to an exponent power in Python.'
    }
  },
  {
    id: 'PY-013',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Length Function in Python',
    description: 'Which built-in function returns the number of items in an iterable object?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) size()', 'B) count()', 'C) len()', 'D) length()'],
      correctAnswer: 2,
      explanation: 'The len() function returns the length (number of items) of an object.'
    }
  },
  {
    id: 'PY-014',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'The pass Statement in Python',
    description: 'What is the primary function of the pass statement in Python code?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) exits program', 'B) skips current iteration', 'C) does nothing (null operation)', 'D) raises an error'],
      correctAnswer: 2,
      explanation: 'The pass statement is a null statement used as a placeholder where syntax requires a statement.'
    }
  },
  {
    id: 'PY-015',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Module Import Keyword',
    description: 'Which keyword brings an external Python module or package into scope?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) include', 'B) using', 'C) import', 'D) require'],
      correctAnswer: 2,
      explanation: 'The import keyword is used to load modules in Python.'
    }
  },

  // Section 2: Data Types
  {
    id: 'PY-016',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Boolean Type in Python',
    description: 'Which built-in type represents truth values True and False?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) int', 'B) bool', 'C) logical', 'D) bit'],
      correctAnswer: 1,
      explanation: 'The bool data type represents logical truth values.'
    }
  },
  {
    id: 'PY-017',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Immutable Data Type in Python',
    description: 'Which of the following built-in collection types is IMMUTABLE?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) list', 'B) dict', 'C) set', 'D) tuple'],
      correctAnswer: 3,
      explanation: 'Tuples cannot be altered once created.'
    }
  },
  {
    id: 'PY-018',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Floating Point Type',
    description: 'What is the data type of the literal value 3.14 in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) int', 'B) decimal', 'C) float', 'D) real'],
      correctAnswer: 2,
      explanation: 'Real numbers with fractional parts belong to the float class.'
    }
  },
  {
    id: 'PY-019',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'String Data Type Keyword',
    description: 'What is the type name for text strings in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) char', 'B) str', 'C) text', 'D) string'],
      correctAnswer: 1,
      explanation: 'Python text sequence objects belong to the str class.'
    }
  },
  {
    id: 'PY-020',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Unique Elements Collection',
    description: 'Which data type automatically eliminates duplicate elements?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) list', 'B) tuple', 'C) set', 'D) string'],
      correctAnswer: 2,
      explanation: 'A set is an unordered collection of unique elements.'
    }
  },
  {
    id: 'PY-021',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Type of None Singleton',
    description: 'What is the type returned by type(None)?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) Null', 'B) NoneType', 'C) void', 'D) nil'],
      correctAnswer: 1,
      explanation: 'None is the sole instance of NoneType.'
    }
  },
  {
    id: 'PY-022',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Key-Value Mapping Structure',
    description: 'Which Python built-in type stores key-value mapping pairs?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) list', 'B) tuple', 'C) dict', 'D) set'],
      correctAnswer: 2,
      explanation: 'Dictionaries (dict) store associative key-value pairs.'
    }
  },
  {
    id: 'PY-023',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Integer Type Conversion',
    description: 'Which built-in constructor converts a compatible value to an integer?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) number()', 'B) int()', 'C) integer()', 'D) toInt()'],
      correctAnswer: 1,
      explanation: 'int() parses strings or numbers into integer objects.'
    }
  },
  {
    id: 'PY-024',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Truth Value of Zero',
    description: 'What value is returned by bool(0) in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) True', 'B) False', 'C) 0', 'D) Error'],
      correctAnswer: 1,
      explanation: 'The integer 0 evaluates to False in Boolean contexts.'
    }
  },
  {
    id: 'PY-025',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Truncating Float Conversion',
    description: 'What is the result of evaluating int(3.9) in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 4', 'B) 3.9', 'C) 3', 'D) Error'],
      correctAnswer: 2,
      explanation: 'int() truncates floating-point numbers towards zero, returning 3.'
    }
  },

  // Section 3: Operators
  {
    id: 'PY-031',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Python Floor Division',
    description: 'What is the output of the expression 10 // 3 in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 3.33', 'B) 3', 'C) 1', 'D) 4'],
      correctAnswer: 1,
      explanation: 'The // operator performs floor division, truncating fractional decimal parts.'
    }
  },
  {
    id: 'PY-032',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Modulus Operator Result',
    description: 'What is the output of 10 % 3 in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 0', 'B) 1', 'C) 3', 'D) 10'],
      correctAnswer: 1,
      explanation: 'The % operator returns the remainder of integer division (10 = 3*3 + 1).'
    }
  },
  {
    id: 'PY-033',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Value Equality Operator',
    description: 'Which operator tests if two values are equal in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) =', 'B) ==', 'C) ===', 'D) equals'],
      correctAnswer: 1,
      explanation: '== tests value equality.'
    }
  },
  {
    id: 'PY-034',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Inequality Operator',
    description: 'Which operator tests if two values are NOT equal in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) <>', 'B) !=', 'C) ~=', 'D) !=='],
      correctAnswer: 1,
      explanation: '!= is the inequality operator.'
    }
  },
  {
    id: 'PY-035',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Power Operator Calculation',
    description: 'What is the result of evaluating 2 ** 3 in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 6', 'B) 8', 'C) 9', 'D) 5'],
      correctAnswer: 1,
      explanation: '2 ** 3 calculates 2 raised to the 3rd power, which is 8.'
    }
  },
  {
    id: 'PY-036',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Logical AND Operator',
    description: 'Which operator performs logical conjunction in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) &', 'B) and', 'C) &&', 'D) AND'],
      correctAnswer: 1,
      explanation: 'The word `and` is the Boolean logical operator.'
    }
  },
  {
    id: 'PY-037',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Membership Operator',
    description: 'What is returned by evaluating \'a\' in \'cat\'?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) True', 'B) False', 'C) Error', 'D) None'],
      correctAnswer: 0,
      explanation: 'The `in` operator checks if a substring is contained within a string.'
    }
  },
  {
    id: 'PY-038',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Identity Operator in Python',
    description: 'Which operator checks if two references point to the exact same memory object?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) ==', 'B) is', 'C) equals', 'D) same'],
      correctAnswer: 1,
      explanation: 'The `is` operator checks identity (same memory address).'
    }
  },

  // Section 4: Control Flow
  {
    id: 'PY-046',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'If Statement Keyword',
    description: 'Which keyword starts a conditional check in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) if', 'B) when', 'C) check', 'D) cond'],
      correctAnswer: 0,
      explanation: 'Python uses `if` to begin conditional code blocks.'
    }
  },
  {
    id: 'PY-047',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Else-If Abbreviation Keyword',
    description: 'What is Python\'s keyword for chained else-if conditions?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) else if', 'B) elif', 'C) elseif', 'D) case'],
      correctAnswer: 1,
      explanation: 'Python uses `elif` as an abbreviation for else if.'
    }
  },
  {
    id: 'PY-048',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Range Function Sequence',
    description: 'What sequence of integers is generated by range(5)?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 1, 2, 3, 4, 5', 'B) 0, 1, 2, 3, 4', 'C) 0, 1, 2, 3, 4, 5', 'D) 1, 2, 3, 4'],
      correctAnswer: 1,
      explanation: 'range(5) generates numbers starting at 0 up to (but not including) 5.'
    }
  },
  {
    id: 'PY-049',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Break Loop Control',
    description: 'What happens when a `break` statement executes inside a loop?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) Exits the nearest enclosing loop', 'B) Skips to next iteration', 'C) Restarts the loop', 'D) Terminates program'],
      correctAnswer: 0,
      explanation: '`break` immediately terminates execution of the innermost loop.'
    }
  },
  {
    id: 'PY-050',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Continue Statement Action',
    description: 'What happens when `continue` executes inside a loop?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) Exits the loop', 'B) Skips remaining code and starts next iteration', 'C) Stops the program', 'D) Re-executes current line'],
      correctAnswer: 1,
      explanation: '`continue` skips the remaining body and proceeds to the next iteration of the loop.'
    }
  },

  // Section 5: Functions & Scope
  {
    id: 'PY-061',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Function Return Value',
    description: 'What value does a Python function return by default if no return statement is specified?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) 0', 'B) False', 'C) None', 'D) Undefined'],
      correctAnswer: 2,
      explanation: 'Functions return None implicitly if no explicit return statement is hit.'
    }
  },
  {
    id: 'PY-062',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Variable Positional Arguments (*args)',
    description: 'In a function signature, what data structure receives positional arguments collected by *args?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) list', 'B) tuple', 'C) dict', 'D) set'],
      correctAnswer: 1,
      explanation: '*args gathers extra positional arguments into a tuple.'
    }
  },
  {
    id: 'PY-063',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Keyword Arguments (**kwargs)',
    description: 'What data structure receives keyword arguments collected by **kwargs in a function signature?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) list', 'B) tuple', 'C) dict', 'D) set'],
      correctAnswer: 2,
      explanation: '**kwargs gathers keyword arguments into a dictionary.'
    }
  },
  {
    id: 'PY-064',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Anonymous Lambda Functions',
    description: 'Which keyword creates small anonymous inline functions in Python?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) lambda', 'B) inline', 'C) fn', 'D) anon'],
      correctAnswer: 0,
      explanation: 'The `lambda` keyword defines anonymous single-expression functions.'
    }
  },

  // Section 6: Strings & Lists
  {
    id: 'PY-076',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'String Immutability',
    description: 'Can individual characters in a Python string be changed in place (e.g. s[0] = "A")?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) Yes', 'B) No', 'C) Only if declared mutable', 'D) Only in Python 2'],
      correctAnswer: 1,
      explanation: 'Python strings are immutable; item assignment raises a TypeError.'
    }
  },
  {
    id: 'PY-077',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'Negative Indexing in Python',
    description: 'What element does s[-1] access in a sequence s?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) The first element', 'B) The middle element', 'C) The last element', 'D) Index 1'],
      correctAnswer: 2,
      explanation: 'Negative indices count backwards from the end (-1 is the last item).'
    }
  },
  {
    id: 'PY-078',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'mcq',
    title: 'List Append Method',
    description: 'Which list method adds a single element to the end of a list?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A) push()', 'B) append()', 'C) add()', 'D) insert()'],
      correctAnswer: 1,
      explanation: 'append() adds its argument as a single element to the end of the list.'
    }
  },

  // Section 7: Coding Interview Challenges
  {
    id: 'PY-101',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Reverse Words in a Sentence',
    description: 'Write a Python function `reverse_words(sentence)` that takes a space-separated string of words and returns a string with the words in reverse order.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def reverse_words(sentence):\n    # Write your code here\n    pass'
      },
      inputDescription: 'A single sentence string.',
      outputDescription: 'String with words in reverse order.',
      constraints: '1 <= len(sentence) <= 1000',
      examples: [
        { input: '"the sky is blue"', output: '"blue is sky the"' },
        { input: '"hello world"', output: '"world hello"' }
      ],
      testCases: [
        { input: '"the sky is blue"', expectedOutput: '"blue is sky the"' },
        { input: '"hello world"', expectedOutput: '"world hello"' }
      ]
    }
  },
  {
    id: 'PY-102',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Check Prime Number',
    description: 'Write a Python function `is_prime(n)` that returns True if integer n is a prime number, otherwise False.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def is_prime(n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'An integer n.',
      outputDescription: 'Boolean value True or False.',
      constraints: '1 <= n <= 10^6',
      examples: [
        { input: '7', output: 'True' },
        { input: '4', output: 'False' }
      ],
      testCases: [
        { input: '7', expectedOutput: 'True' },
        { input: '4', expectedOutput: 'False' }
      ]
    }
  },
  {
    id: 'PY-103',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Factorial of a Number',
    description: 'Write a Python function `factorial(n)` that computes the factorial of a non-negative integer `n`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def factorial(n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Non-negative integer n.',
      outputDescription: 'Factorial integer result.',
      constraints: '0 <= n <= 20',
      examples: [
        { input: '5', output: '120' },
        { input: '0', output: '1' }
      ],
      testCases: [
        { input: '5', expectedOutput: '120' },
        { input: '0', expectedOutput: '1' }
      ]
    }
  },
  {
    id: 'PY-104',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Fibonacci Series N-th Term',
    description: 'Write a Python function `fibonacci(n)` that returns the n-th Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1...).',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def fibonacci(n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'An integer n.',
      outputDescription: 'N-th Fibonacci number.',
      constraints: '0 <= n <= 30',
      examples: [
        { input: '6', output: '8' },
        { input: '0', output: '0' }
      ],
      testCases: [
        { input: '6', expectedOutput: '8' },
        { input: '0', expectedOutput: '0' }
      ]
    }
  },
  {
    id: 'PY-105',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Palindrome String Check',
    description: 'Write a Python function `is_palindrome(s)` that returns True if a string `s` is a palindrome (ignoring case and non-alphanumeric characters), otherwise False.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def is_palindrome(s):\n    # Write your code here\n    pass'
      },
      inputDescription: 'A string s.',
      outputDescription: 'Boolean True or False.',
      constraints: '1 <= len(s) <= 1000',
      examples: [
        { input: '"A man, a plan, a canal: Panama"', output: 'True' },
        { input: '"race a car"', output: 'False' }
      ],
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True' },
        { input: '"race a car"', expectedOutput: 'False' }
      ]
    }
  },
  {
    id: 'PY-106',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Sum of Digits',
    description: 'Write a Python function `sum_of_digits(n)` that returns the sum of all digits of an integer `n`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def sum_of_digits(n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'An integer n.',
      outputDescription: 'Sum of digits integer.',
      constraints: '0 <= n <= 10^9',
      examples: [
        { input: '12345', output: '15' },
        { input: '908', output: '17' }
      ],
      testCases: [
        { input: '12345', expectedOutput: '15' },
        { input: '908', expectedOutput: '17' }
      ]
    }
  },
  {
    id: 'PY-107',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Greatest Common Divisor (GCD)',
    description: 'Write a Python function `gcd(a, b)` that calculates and returns the Greatest Common Divisor of two positive integers `a` and `b`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def gcd(a, b):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Two integers a and b.',
      outputDescription: 'GCD integer.',
      constraints: '1 <= a, b <= 10^9',
      examples: [
        { input: '48, 18', output: '6' },
        { input: '101, 10', output: '1' }
      ],
      testCases: [
        { input: '48, 18', expectedOutput: '6' },
        { input: '101, 10', expectedOutput: '1' }
      ]
    }
  },
  {
    id: 'PY-108',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Least Common Multiple (LCM)',
    description: 'Write a Python function `lcm(a, b)` that returns the Least Common Multiple of two integers `a` and `b`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def lcm(a, b):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Two positive integers a and b.',
      outputDescription: 'LCM integer.',
      constraints: '1 <= a, b <= 10^6',
      examples: [
        { input: '12, 18', output: '36' },
        { input: '5, 7', output: '35' }
      ],
      testCases: [
        { input: '12, 18', expectedOutput: '36' },
        { input: '5, 7', expectedOutput: '35' }
      ]
    }
  },
  {
    id: 'PY-109',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Leap Year Check',
    description: 'Write a Python function `is_leap_year(year)` that returns True if `year` is a leap year, otherwise False.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def is_leap_year(year):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Integer year.',
      outputDescription: 'Boolean True or False.',
      constraints: '1 <= year <= 9999',
      examples: [
        { input: '2020', output: 'True' },
        { input: '1900', output: 'False' }
      ],
      testCases: [
        { input: '2020', expectedOutput: 'True' },
        { input: '1900', expectedOutput: 'False' }
      ]
    }
  },
  {
    id: 'PY-110',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Armstrong Number Check',
    description: 'Write a Python function `is_armstrong(n)` that returns True if `n` is an Armstrong number (sum of digits raised to power of total digit count equals n).',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def is_armstrong(n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Non-negative integer n.',
      outputDescription: 'Boolean True or False.',
      constraints: '0 <= n <= 10^6',
      examples: [
        { input: '153', output: 'True' },
        { input: '123', output: 'False' }
      ],
      testCases: [
        { input: '153', expectedOutput: 'True' },
        { input: '123', expectedOutput: 'False' }
      ]
    }
  },
  {
    id: 'PY-111',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Count Vowels and Consonants',
    description: 'Write a Python function `count_vowels_consonants(s)` that returns a tuple `(vowels, consonants)` for the given string `s`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def count_vowels_consonants(s):\n    # Write your code here\n    pass'
      },
      inputDescription: 'String s.',
      outputDescription: 'Tuple (vowels_count, consonants_count).',
      constraints: '1 <= len(s) <= 1000',
      examples: [
        { input: '"hello world"', output: '(3, 7)' }
      ],
      testCases: [
        { input: '"hello world"', expectedOutput: '(3, 7)' }
      ]
    }
  },
  {
    id: 'PY-112',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Anagram Check',
    description: 'Write a Python function `are_anagrams(s1, s2)` that returns True if strings `s1` and `s2` are anagrams of each other.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def are_anagrams(s1, s2):\n    # Write your code here\n    pass'
      },
      inputDescription: 'Two strings s1 and s2.',
      outputDescription: 'Boolean True or False.',
      constraints: '1 <= len(s1), len(s2) <= 1000',
      examples: [
        { input: '"listen", "silent"', output: 'True' },
        { input: '"hello", "world"', output: 'False' }
      ],
      testCases: [
        { input: '"listen", "silent"', expectedOutput: 'True' },
        { input: '"hello", "world"', expectedOutput: 'False' }
      ]
    }
  },
  {
    id: 'PY-113',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Find Missing Number from 1 to N',
    description: 'Write a Python function `find_missing(nums, n)` that finds the single missing integer from an unsorted list containing numbers from 1 to `n`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def find_missing(nums, n):\n    # Write your code here\n    pass'
      },
      inputDescription: 'List of numbers and integer n.',
      outputDescription: 'Missing integer.',
      constraints: '1 <= n <= 10^5',
      examples: [
        { input: '[1, 2, 4, 5, 6], n=6', output: '3' }
      ],
      testCases: [
        { input: 'nums=[1, 2, 4, 5, 6], n=6', expectedOutput: '3' }
      ]
    }
  },
  {
    id: 'PY-114',
    categoryId: 'cat-python',
    categoryName: 'Python',
    type: 'coding',
    title: 'Two Sum Problem',
    description: 'Write a Python function `two_sum(nums, target)` that returns 0-based indices of the two numbers in `nums` that add up to `target`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['python'],
      starterCode: {
        python: 'def two_sum(nums, target):\n    # Write your code here\n    pass'
      },
      inputDescription: 'List of numbers and target sum integer.',
      outputDescription: 'List containing two indices.',
      constraints: '2 <= len(nums) <= 10^4',
      examples: [
        { input: '[2, 7, 11, 15], target=9', output: '[0, 1]' }
      ],
      testCases: [
        { input: 'nums=[2, 7, 11, 15], target=9', expectedOutput: '[0, 1]' }
      ]
    }
  },

  // --- C ---
  {
    id: 'q-c-1',
    categoryId: 'cat-c',
    categoryName: 'C',
    type: 'coding',
    title: 'Find Maximum in Array (C)',
    description: 'Write a C function `find_max(int arr[], int n)` that returns the largest integer in an array of size `n`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['c'],
      starterCode: {
        c: '#include <stdio.h>\n\nint find_max(int arr[], int n) {\n    // Write your code here\n    return 0;\n}'
      },
      inputDescription: 'Array of integers and size n.',
      outputDescription: 'Maximum integer.',
      constraints: '1 <= n <= 1000',
      examples: [{ input: 'arr = [3, 7, 2, 9, 5], n = 5', output: '9' }],
      testCases: [
        { input: 'arr=[3, 7, 2, 9, 5], n=5', expectedOutput: '9' },
        { input: 'arr=[-1, -5, -2], n=3', expectedOutput: '-1' }
      ]
    }
  },
  {
    id: 'q-c-2',
    categoryId: 'cat-c',
    categoryName: 'C',
    type: 'mcq',
    title: 'C Dynamic Memory Allocation',
    description: 'Which standard library function in C is used to dynamically allocate memory and initialize all bytes to zero?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['malloc()', 'calloc()', 'realloc()', 'free()'],
      correctAnswer: 1,
      explanation: 'calloc(num, size) allocates memory for an array of num elements and initializes every byte to 0.'
    }
  },

  // --- C++ ---
  {
    id: 'q-cpp-1',
    categoryId: 'cat-cpp',
    categoryName: 'C++',
    type: 'coding',
    title: 'Check Palindrome String (C++)',
    description: 'Write a C++ function `isPalindrome(string s)` that returns true if the input string reads the same forwards and backwards, ignoring non-alphanumeric characters and case.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['cpp'],
      starterCode: {
        cpp: '#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Write your code here\n    return false;\n}'
      },
      inputDescription: 'A string s.',
      outputDescription: 'Boolean true/false.',
      constraints: '1 <= s.length <= 10^5',
      examples: [
        { input: '"A man, a plan, a canal: Panama"', output: 'true' },
        { input: '"race a car"', output: 'false' }
      ],
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
        { input: '"race a car"', expectedOutput: 'false' }
      ]
    }
  },
  {
    id: 'q-cpp-2',
    categoryId: 'cat-cpp',
    categoryName: 'C++',
    type: 'mcq',
    title: 'C++ Virtual Functions',
    description: 'Why are `virtual` functions used in C++?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: [
        'To speed up function calls',
        'To enable runtime polymorphism / dynamic binding',
        'To prevent derived classes from overriding functions',
        'To restrict access to private members'
      ],
      correctAnswer: 1,
      explanation: 'Virtual functions allow C++ derived classes to override base class implementations at runtime (dynamic dispatch).'
    }
  },

  // --- JAVA ---
  {
    id: 'q-java-1',
    categoryId: 'cat-java',
    categoryName: 'Java',
    type: 'coding',
    title: 'Count Character Frequencies (Java)',
    description: 'Write a Java method `charCount(String str)` that counts the frequency of each character in a given string and returns a formatted string like `a2b1c3`.',
    createdAt: new Date().toISOString(),
    codingData: {
      supportedLanguages: ['java'],
      starterCode: {
        java: 'public class Solution {\n    public static String charCount(String str) {\n        // Write your code here\n        return "";\n    }\n}'
      },
      inputDescription: 'Input string.',
      outputDescription: 'Character frequency string.',
      constraints: '1 <= str.length <= 1000',
      examples: [{ input: '"aabccc"', output: '"a2b1c3"' }],
      testCases: [{ input: '"aabccc"', expectedOutput: '"a2b1c3"' }]
    }
  },
  {
    id: 'q-java-2',
    categoryId: 'cat-java',
    categoryName: 'Java',
    type: 'mcq',
    title: 'Java Interface vs Abstract Class',
    description: 'In Java 8+, which feature is supported in an interface that was traditionally restricted to abstract classes?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: [
        'Multiple inheritance of state (instance fields)',
        'Default and static method implementations with bodies',
        'Constructors',
        'Private instance variables'
      ],
      correctAnswer: 1,
      explanation: 'Java 8 introduced default methods and static methods in interfaces, allowing methods to have default concrete implementations.'
    }
  },

  // --- QUANTITATIVE APTITUDE ---
  {
    id: 'q-apt-1',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Salary Net Percentage Change (Percentages)',
    description: 'A company increases an employee\'s salary by 20% and then decreases it by 10%. What is the overall percentage change in the salary?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 8% increase', 'B. 10% increase', 'C. 8% decrease', 'D. 10% decrease'],
      correctAnswer: 0,
      explanation: 'Assume original salary is 100.\nAfter 20% increase: 100 × 1.20 = 120.\nAfter 10% decrease: 120 × 0.90 = 108.\nOverall increase = 108 - 100 = 8% increase.'
    }
  },
  {
    id: 'q-apt-2',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Cost Price & Selling Price Ratio (Profit & Loss)',
    description: 'If the cost price of 15 items is equal to the selling price of 12 items, find the profit percentage.',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 20%', 'B. 25%', 'C. 30%', 'D. 15%'],
      correctAnswer: 1,
      explanation: '15 × CP = 12 × SP => SP / CP = 15 / 12 = 5 / 4.\nProfit = 5 - 4 = 1 unit.\nProfit % = (1 / 4) × 100 = 25%.'
    }
  },
  {
    id: 'q-apt-3',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Combined Efficiency (Time & Work)',
    description: 'A can complete a task in 12 days and B in 24 days. Working together, in how many days will they finish the task?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 6 days', 'B. 8 days', 'C. 10 days', 'D. 9 days'],
      correctAnswer: 1,
      explanation: 'A\'s 1-day work = 1/12. B\'s 1-day work = 1/24.\nCombined 1-day work = 1/12 + 1/24 = 3/24 = 1/8.\nTherefore, working together they finish the task in 8 days.'
    }
  },
  {
    id: 'q-apt-4',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Round Trip Average Speed (Time, Speed & Distance)',
    description: 'A driver travels from City A to City B at a speed of 40 km/h and returns along the same route at 60 km/h. What is the average speed for the entire journey?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 50 km/h', 'B. 48 km/h', 'C. 52 km/h', 'D. 45 km/h'],
      correctAnswer: 1,
      explanation: 'For equal distance, Average Speed = 2xy / (x + y) = (2 × 40 × 60) / (40 + 60) = 4800 / 100 = 48 km/h.'
    }
  },
  {
    id: 'q-apt-5',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Find the Remainder (Number System)',
    description: 'What is the remainder when 7^84 is divided by 342?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 1', 'B. 7', 'C. 49', 'D. 341'],
      correctAnswer: 0,
      explanation: '7^3 = 343 = 342 + 1.\nSo 7^84 = (7^3)^28 = (342 + 1)^28.\nWhen divided by 342, the remainder is 1^28 = 1.'
    }
  },
  {
    id: 'q-apt-6',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'HCF & LCM Product Relation (HCF & LCM)',
    description: 'The HCF of two numbers is 11 and their LCM is 693. If one number is 77, find the other number.',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 63', 'B. 99', 'C. 121', 'D. 88'],
      correctAnswer: 1,
      explanation: 'Product of two numbers = HCF × LCM.\n77 × X = 11 × 693 => X = (11 × 693) / 77 = 693 / 7 = 99.'
    }
  },
  {
    id: 'q-apt-7',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'CI vs SI Difference for 2 Years (Compound Interest)',
    description: 'The difference between Compound Interest and Simple Interest on $10,000 for 2 years at 5% per annum is:',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. $25', 'B. $50', 'C. $20', 'D. $30'],
      correctAnswer: 0,
      explanation: 'For 2 years, Difference = P × (R/100)^2 = 10,000 × (5/100)^2 = 10,000 × (25/10,000) = $25.'
    }
  },
  {
    id: 'q-apt-8',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Word Letter Arrangements (Permutation & Combination)',
    description: 'In how many different ways can the letters of the word "LEADER" be arranged?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 720', 'B. 360', 'C. 180', 'D. 120'],
      correctAnswer: 1,
      explanation: 'The word "LEADER" has 6 letters in total with "E" repeating twice.\nTotal arrangements = 6! / 2! = 720 / 2 = 360.'
    }
  },
  {
    id: 'q-apt-9',
    categoryId: 'cat-aptitude',
    categoryName: 'Quantitative Aptitude',
    type: 'mcq',
    title: 'Rolling Two Dice Probability (Probability)',
    description: 'Two unbiased six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers is 8?',
    createdAt: new Date().toISOString(),
    mcqData: {
      options: ['A. 5/36', 'B. 1/6', 'C. 7/36', 'D. 1/9'],
      correctAnswer: 0,
      explanation: 'Favorable outcomes for sum = 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes.\nTotal outcomes = 36.\nProbability = 5/36.'
    }
  }
];

class DatabaseService {
  private data: DbSchema = {
    users: [],
    passwords: {},
    categories: [],
    questions: [],
    submissions: [],
    studyRooms: [],
    roomMembers: [],
    chatMessages: [],
    roomActivities: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.passwords) {
          this.data.passwords = {};
        }
        if (!this.data.users) {
          this.data.users = [];
        }
        console.log('Database loaded from file successfully.');

        // Remove any former aptitude category or questions if present
        const origCatCount = this.data.categories.length;
        const origQCount = this.data.questions.length;
        let changed = false;

        // Clean up former questions if present and sync all question banks
        this.data.questions = this.data.questions.filter((q) => {
          if (['cat-python', 'cat-c', 'cat-cpp', 'cat-java', 'cat-dsa', 'cat-hr', 'cat-sql'].includes(q.categoryId)) return false;
          if (q.id === 'q-py-1' || q.id === 'q-py-2' || q.id === 'q-sql-1' || q.id === 'q-c-1' || q.id === 'q-c-2' || q.id === 'q-cpp-1' || q.id === 'q-cpp-2' || q.id === 'q-java-1' || q.id === 'q-java-2') return false;
          return true;
        });

        // Sync initial categories
        for (const cat of INITIAL_CATEGORIES) {
          if (!this.data.categories.some((c) => c.id === cat.id)) {
            this.data.categories.push(cat);
            changed = true;
          }
        }

        // Sync initial questions & update existing questions with updated metadata
        const parsedQuestions = [
          ...parseDsaQuestionBank(),
          ...parseHrQuestionBank(),
          ...parseSqlQueries(),
          ...parseSqlMcqBank(),
          ...parsePythonQuestionBank(),
          ...parseCQuestionBank(),
          ...parseCppQuestionBank(),
          ...parseJavaQuestionBank(),
        ];
        const initialFiltered = INITIAL_QUESTIONS.filter(q => !['cat-python', 'cat-c', 'cat-cpp', 'cat-java', 'cat-dsa', 'cat-hr', 'cat-sql'].includes(q.categoryId));
        const allSeedQuestions = [...initialFiltered, ...parsedQuestions];
        for (const q of allSeedQuestions) {
          const existingIdx = this.data.questions.findIndex((ex) => ex.id === q.id);
          if (existingIdx === -1) {
            this.data.questions.push(q);
            changed = true;
          } else {
            // Update question content while retaining solved flag
            const wasSolved = this.data.questions[existingIdx].solved;
            this.data.questions[existingIdx] = { ...q, solved: wasSolved };
            changed = true;
          }
        }

        this.persist();
      } catch (err) {
        console.error('Error reading data store, reinitializing:', err);
        this.seedDefaultData();
      }
    } else {
      this.seedDefaultData();
    }
  }

  private persist() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing data store to file:', err);
    }
  }

  private seedDefaultData() {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const demoPasswordHash = bcrypt.hashSync('demo123', 10);

    const adminUser: User = {
      id: 'usr-admin',
      name: 'HirePrep Admin',
      username: 'admin',
      email: 'admin@hireprep.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
    };

    const demoUser: User = {
      id: 'usr-demo',
      name: 'Rahul Sharma',
      username: 'rahul',
      email: 'rahul@example.com',
      role: 'user',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      createdAt: new Date().toISOString(),
    };

    this.data.users = [adminUser, demoUser];
    this.data.passwords = {
      'usr-admin': adminPasswordHash,
      'usr-demo': demoPasswordHash,
    };
    this.data.categories = INITIAL_CATEGORIES;
    this.data.questions = [
      ...parseDsaQuestionBank(),
      ...parseHrQuestionBank(),
      ...parseSqlQueries(),
      ...parseSqlMcqBank(),
      ...parsePythonQuestionBank(),
      ...parseCQuestionBank(),
      ...parseCppQuestionBank(),
      ...parseJavaQuestionBank(),
    ];
    this.data.submissions = [];
    this.data.studyRooms = [];
    this.data.roomMembers = [];
    this.data.chatMessages = [];
    this.data.roomActivities = [];

    this.persist();
  }

  // --- Users ---
  getAllUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmailOrUsername(term: string): User | undefined {
    if (!term) return undefined;
    const lower = term.toLowerCase().trim();
    return this.data.users.find(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === lower) ||
        (u.username && u.username.toLowerCase().trim() === lower)
    );
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>, passwordPlain: string): User {
    const id = 'usr-' + Math.random().toString(36).substring(2, 9);
    const cleanPassword = passwordPlain ? passwordPlain.trim() : '';
    const hashedPassword = bcrypt.hashSync(cleanPassword, 10);
    const newUser: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };
    if (!this.data.passwords) {
      this.data.passwords = {};
    }
    this.data.users.push(newUser);
    this.data.passwords[id] = hashedPassword;
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>, newPasswordPlain?: string): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    if (!this.data.passwords) {
      this.data.passwords = {};
    }
    if (newPasswordPlain) {
      this.data.passwords[id] = bcrypt.hashSync(newPasswordPlain.trim(), 10);
    }
    this.persist();
    return this.data.users[idx];
  }

  deleteUser(id: string): boolean {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    if (this.data.passwords) {
      delete this.data.passwords[id];
    }
    this.persist();
    return true;
  }

  verifyPassword(userId: string, passwordPlain: string): boolean {
    if (!this.data.passwords) return false;
    const hashed = this.data.passwords[userId];
    if (!hashed) return false;
    const cleanPassword = passwordPlain ? passwordPlain.trim() : '';
    return bcrypt.compareSync(cleanPassword, hashed) || bcrypt.compareSync(passwordPlain, hashed);
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  addCategory(name: string, description: string): Category {
    const id = 'cat-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cat: Category = { id, name, description };
    this.data.categories.push(cat);
    this.persist();
    return cat;
  }

  // --- Questions ---
  getQuestions(filters?: { categoryId?: string; type?: string; search?: string; userId?: string }): Question[] {
    let list = [...this.data.questions];

    if (filters?.categoryId) {
      list = list.filter((q) => q.categoryId === filters.categoryId);
    }
    if (filters?.type) {
      list = list.filter((q) => q.type === filters.type);
    }
    if (filters?.search) {
      const qStr = filters.search.toLowerCase();
      list = list.filter(
        (q) => q.title.toLowerCase().includes(qStr) || q.categoryName.toLowerCase().includes(qStr)
      );
    }

    if (filters?.userId) {
      const userSubmissions = this.data.submissions.filter((s) => s.userId === filters.userId);
      list = list.map((q) => {
        const sub = userSubmissions.find((s) => s.questionId === q.id);
        return {
          ...q,
          solved: sub?.status === 'correct' || sub?.status === 'accepted',
          userStatus: sub?.status,
        };
      });
    }

    return list;
  }

  getQuestionById(id: string, userId?: string): Question | undefined {
    const q = this.data.questions.find((item) => item.id === id);
    if (!q) return undefined;

    if (userId) {
      const sub = this.data.submissions.find((s) => s.userId === userId && s.questionId === id);
      return {
        ...q,
        solved: sub?.status === 'correct' || sub?.status === 'accepted',
        userStatus: sub?.status,
      };
    }
    return q;
  }

  createQuestion(qData: Omit<Question, 'id' | 'createdAt'>): Question {
    const id = 'q-' + Math.random().toString(36).substring(2, 9);
    const newQ: Question = {
      ...qData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.questions.push(newQ);
    this.persist();
    return newQ;
  }

  updateQuestion(id: string, qData: Partial<Question>): Question | undefined {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx === -1) return undefined;
    this.data.questions[idx] = { ...this.data.questions[idx], ...qData };
    this.persist();
    return this.data.questions[idx];
  }

  deleteQuestion(id: string): boolean {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    this.data.questions.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Submissions ---
  addSubmission(sub: Omit<Submission, 'id' | 'submittedAt'>): Submission {
    const id = 'sub-' + Math.random().toString(36).substring(2, 9);
    const newSub: Submission = {
      ...sub,
      id,
      submittedAt: new Date().toISOString(),
    };
    this.data.submissions.push(newSub);
    this.persist();
    return newSub;
  }

  getUserSubmissions(userId: string): Submission[] {
    return this.data.submissions.filter((s) => s.userId === userId);
  }

  getAllSubmissions(): Submission[] {
    return this.data.submissions;
  }

  // --- Study Rooms ---
  createStudyRoom(name: string, description: string | undefined, hostUser: User): StudyRoom {
    const roomId = 'HP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const id = 'room-' + Math.random().toString(36).substring(2, 9);

    const room: StudyRoom = {
      id,
      roomId,
      name,
      description,
      hostId: hostUser.id,
      hostName: hostUser.name || hostUser.username,
      createdAt: new Date().toISOString(),
    };

    this.data.studyRooms.push(room);

    // Add host as first member
    const member: RoomMember = {
      id: 'mem-' + Math.random().toString(36).substring(2, 9),
      roomId: room.id,
      userId: hostUser.id,
      username: hostUser.username,
      avatar: hostUser.avatar,
      score: 0,
      questionsSolved: 0,
      correctAnswers: 0,
      isOnline: true,
      joinedAt: new Date().toISOString(),
      isHost: true,
      currentActivity: 'Joined room',
      solvingStatus: 'Not Started',
    };
    this.data.roomMembers.push(member);

    this.persist();
    return room;
  }

  getStudyRoomByCode(code: string): StudyRoom | undefined {
    return this.data.studyRooms.find((r) => r.roomId.toUpperCase() === code.toUpperCase().trim());
  }

  getStudyRoomById(id: string): StudyRoom | undefined {
    return this.data.studyRooms.find((r) => r.id === id);
  }

  getAllStudyRooms(): StudyRoom[] {
    return this.data.studyRooms;
  }

  joinRoom(roomId: string, user: User): RoomMember {
    let member = this.data.roomMembers.find((m) => m.roomId === roomId && m.userId === user.id);
    if (!member) {
      member = {
        id: 'mem-' + Math.random().toString(36).substring(2, 9),
        roomId,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        score: 0,
        questionsSolved: 0,
        correctAnswers: 0,
        isOnline: true,
        joinedAt: new Date().toISOString(),
        isHost: false,
        currentActivity: 'Joined room',
        solvingStatus: 'Not Started',
      };
      this.data.roomMembers.push(member);
    } else {
      member.isOnline = true;
    }
    this.persist();
    return member;
  }

  getRoomMembers(roomId: string): RoomMember[] {
    return this.data.roomMembers.filter((m) => m.roomId === roomId);
  }

  updateRoomMemberScore(roomId: string, userId: string, pointsEarned: number) {
    const member = this.data.roomMembers.find((m) => m.roomId === roomId && m.userId === userId);
    if (member) {
      member.score += pointsEarned;
      member.questionsSolved += 1;
      member.correctAnswers += 1;
      member.solvingStatus = 'Correct';
      this.persist();
    }
  }

  updateRoomMemberStatus(roomId: string, userId: string, activity: string, solvingStatus?: RoomMember['solvingStatus']) {
    const member = this.data.roomMembers.find((m) => m.roomId === roomId && m.userId === userId);
    if (member) {
      member.currentActivity = activity;
      if (solvingStatus) member.solvingStatus = solvingStatus;
      this.persist();
    }
  }

  // --- Chat ---
  addChatMessage(roomId: string, userId: string, username: string, message: string, avatar?: string): ChatMessage {
    const msg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      roomId,
      userId,
      username,
      avatar,
      message,
      createdAt: new Date().toISOString(),
    };
    this.data.chatMessages.push(msg);
    this.persist();
    return msg;
  }

  getRoomMessages(roomId: string): ChatMessage[] {
    return this.data.chatMessages.filter(
      (m) => m.roomId === roomId && !m.message.startsWith('New question selected:')
    );
  }

  // --- Analytics & User Progress ---
  getUserProgress(userId: string): UserProgressStats {
    const userSubs = this.data.submissions.filter((s) => s.userId === userId);
    const userRooms = this.data.roomMembers.filter((m) => m.userId === userId);

    const solvedQuestions = new Set<string>();
    const correctQuestions = new Set<string>();

    let mcqsSolved = 0;
    let codingSolved = 0;
    let sqlSolved = 0;
    let totalScore = 0;

    const categoryBreakdown: Record<string, { solved: number; total: number; correct: number }> = {};
    
    this.data.categories.forEach((cat) => {
      const catQuestions = this.data.questions.filter((q) => q.categoryId === cat.id);
      categoryBreakdown[cat.name] = { solved: 0, total: catQuestions.length, correct: 0 };
    });

    userSubs.forEach((sub) => {
      solvedQuestions.add(sub.questionId);
      totalScore += sub.score || 0;

      if (sub.status === 'correct' || sub.status === 'accepted') {
        correctQuestions.add(sub.questionId);
        if (sub.type === 'mcq') mcqsSolved++;
        if (sub.type === 'coding') codingSolved++;

        if (categoryBreakdown[sub.categoryName]) {
          categoryBreakdown[sub.categoryName].solved += 1;
          categoryBreakdown[sub.categoryName].correct += 1;
        }
      }
    });

    const totalSolved = solvedQuestions.size;
    const totalCorrect = correctQuestions.size;
    const accuracy = userSubs.length > 0 ? Math.round((totalCorrect / userSubs.length) * 100) : 0;

    return {
      totalSolved,
      totalCorrect,
      accuracy,
      mcqsSolved,
      codingSolved,
      sqlSolved,
      studyRoomsJoined: userRooms.length,
      totalScore,
      categoryBreakdown,
      solvedQuestionIds: Array.from(correctQuestions),
      recentSubmissions: userSubs.slice(-10).reverse(),
    };
  }

  getAdminStats(): AdminStats {
    const today = new Date().toISOString().split('T')[0];
    const solvedToday = this.data.submissions.filter((s) => s.submittedAt.startsWith(today)).length;

    return {
      totalUsers: this.data.users.length,
      totalQuestions: this.data.questions.length,
      totalSubmissions: this.data.submissions.length,
      activeStudyRooms: this.data.studyRooms.length,
      questionsSolvedToday: solvedToday,
    };
  }
}

export const db = new DatabaseService();
