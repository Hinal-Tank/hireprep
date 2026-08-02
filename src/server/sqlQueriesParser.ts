import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parseSqlQueries(): Question[] {
  const filePath = path.join(process.cwd(), 'SQL_Interview_Queries_and_Answers (1).md');
  if (!fs.existsSync(filePath)) {
    console.warn('SQL_Interview_Queries_and_Answers (1).md not found at', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const questions: Question[] = [];

  let currentTopic = 'SQL Queries';
  let currentTitle = '';
  let currentSql = '';

  const defaultSchema = `
CREATE TABLE IF NOT EXISTS departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    department_id INT,
    manager_id INT,
    salary DECIMAL(10,2),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
`;

  const defaultSampleData = `
INSERT OR IGNORE INTO departments (department_id, department_name, location) VALUES
(10, 'Engineering', 'Ahmedabad'),
(20, 'Human Resources', 'Mumbai'),
(30, 'Finance', 'Pune'),
(40, 'Marketing', 'Delhi'),
(50, 'Sales', 'Bengaluru');

INSERT OR IGNORE INTO employees (employee_id, employee_name, email, department_id, manager_id, salary, hire_date, status) VALUES
(101, 'Aarav Shah', 'aarav@company.com', 10, NULL, 120000, '2020-01-15', 'ACTIVE'),
(102, 'Hina Patel', 'hina@company.com', 10, 101, 95000, '2021-03-10', 'ACTIVE'),
(103, 'Riya Mehta', 'riya@company.com', 10, 101, 85000, '2022-06-20', 'ACTIVE'),
(104, 'Rahul Desai', 'rahul@company.com', 20, NULL, 85000, '2023-02-12', 'ACTIVE'),
(105, 'Neha Shah', 'neha@company.com', 30, NULL, 72000, '2024-04-18', 'ACTIVE');
`;

  let qCount = 1;
  let inSqlCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ') && !line.includes('Sample Schema')) {
      currentTopic = line.replace('## ', '').trim();
      continue;
    }

    if (line.startsWith('### ')) {
      currentTitle = line.replace('### ', '').trim();
      currentSql = '';
      continue;
    }

    if (line.startsWith('```sql')) {
      inSqlCode = true;
      currentSql = '';
      continue;
    }

    if (line.startsWith('```') && inSqlCode) {
      inSqlCode = false;

      if (currentTitle && currentSql) {
        const id = `SQL-QUERY-${qCount++}`;
        questions.push({
          id,
          categoryId: 'cat-sql',
          categoryName: 'SQL',
          type: 'sql',
          title: `${currentTopic}: ${currentTitle}`,
          description: `Write a SQL query for the following requirement:\n\n**${currentTitle}**\n\n**Topic:** ${currentTopic}`,
          createdAt: new Date().toISOString(),
          sqlData: {
            schema: defaultSchema,
            sampleData: defaultSampleData,
            correctQuery: currentSql.trim(),
            expectedResult: [],
            sampleTables: [
              {
                name: 'departments',
                columns: ['department_id', 'department_name', 'location'],
                rows: [
                  [10, 'Engineering', 'Ahmedabad'],
                  [20, 'Human Resources', 'Mumbai'],
                  [30, 'Finance', 'Pune'],
                  [40, 'Marketing', 'Delhi'],
                  [50, 'Sales', 'Bengaluru'],
                  [60, 'Operations', 'Hyderabad'],
                ],
              },
              {
                name: 'employees',
                columns: ['employee_id', 'employee_name', 'email', 'department_id', 'manager_id', 'salary', 'hire_date', 'status'],
                rows: [
                  [101, 'Aarav Shah', 'aarav@company.com', 10, 'NULL', 120000, '2020-01-15', 'ACTIVE'],
                  [102, 'Hina Patel', 'hina@company.com', 10, 101, 95000, '2021-03-10', 'ACTIVE'],
                  [103, 'Riya Mehta', 'riya@company.com', 10, 101, 85000, '2022-06-20', 'ACTIVE'],
                  [104, 'Rahul Desai', 'rahul@company.com', 20, 'NULL', 85000, '2023-02-12', 'ACTIVE'],
                  [105, 'Neha Shah', 'neha@company.com', 30, 'NULL', 72000, '2024-04-18', 'ACTIVE'],
                  [109, 'Priya Shah', 'priya@company.com', 20, 'NULL', 90000, '2020-05-10', 'ACTIVE'],
                ],
              },
            ],
          },
        });
      }
      currentTitle = '';
      currentSql = '';
      continue;
    }

    if (inSqlCode) {
      currentSql += line + '\n';
    }
  }

  console.log(`Parsed ${questions.length} SQL Queries from SQL_Interview_Queries_and_Answers (1).md`);
  return questions;
}
