# SQL Interview Query Bank

> **Focus:** Interview questions + SQL query answers only.
> **Coverage:** All 26 requested SQL topics.
> **Dialect:** Core SQL with MySQL-compatible examples where procedural syntax is required. Adjust syntax for PostgreSQL, SQL Server or Oracle when needed.

## Sample Schema
```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    department_id INT,
    manager_id INT,
    salary DECIMAL(10,2),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);
```

## 1. Database Fundamentals

### 1. Find all employees with their department names.

```sql
SELECT e.employee_id, e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
```

### 2. Find employees who do not belong to any department.

```sql
SELECT e.employee_id, e.employee_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.department_id IS NULL;
```

## 2. SQL Fundamentals

### 1. Retrieve all employees.

```sql
SELECT * FROM employees;
```

### 2. Retrieve only employee names and salaries.

```sql
SELECT employee_name, salary FROM employees;
```

### 3. Retrieve unique department IDs.

```sql
SELECT DISTINCT department_id FROM employees;
```

### 4. Create an alias for the salary column.

```sql
SELECT salary AS monthly_salary FROM employees;
```

## 3. DDL

### 1. Create an employees table with basic constraints.

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department_id INT,
    salary DECIMAL(10,2)
);
```

### 2. Add an email column to employees.

```sql
ALTER TABLE employees ADD COLUMN email VARCHAR(150);
```

### 3. Remove the email column.

```sql
ALTER TABLE employees DROP COLUMN email;
```

### 4. Create an index on department_id.

```sql
CREATE INDEX idx_employee_department ON employees(department_id);
```

## 4. DML

### 1. Insert a new employee.

```sql
INSERT INTO employees
(employee_id, employee_name, department_id, salary)
VALUES (101, 'Asha', 10, 65000);
```

### 2. Increase salaries by 10% for department 10.

```sql
UPDATE employees SET salary = salary * 1.10 WHERE department_id = 10;
```

### 3. Delete employees earning less than 25000.

```sql
DELETE FROM employees WHERE salary < 25000;
```

## 5. DQL

### 1. Find employees earning more than 50000.

```sql
SELECT * FROM employees WHERE salary > 50000;
```

### 2. Find the top 5 highest-paid employees.

```sql
SELECT * FROM employees ORDER BY salary DESC LIMIT 5;
```

### 3. Find employees hired after 2025-01-01.

```sql
SELECT * FROM employees WHERE hire_date > '2025-01-01';
```

## 6. DCL

### 1. Grant SELECT and INSERT privileges on employees to app_user.

```sql
GRANT SELECT, INSERT ON employees TO app_user;
```

### 2. Revoke INSERT privilege from app_user.

```sql
REVOKE INSERT ON employees FROM app_user;
```

## 7. TCL

### 1. Transfer 1000 from account 1 to account 2 safely.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 2;
COMMIT;
```

### 2. Rollback an accidental update.

```sql
START TRANSACTION;
UPDATE employees SET salary = salary * 2 WHERE department_id = 10;
ROLLBACK;
```

### 3. Use a savepoint during a transaction.

```sql
START TRANSACTION;
UPDATE employees SET salary = salary + 1000 WHERE department_id = 10;
SAVEPOINT salary_update;
UPDATE employees SET salary = salary + 500 WHERE department_id = 20;
ROLLBACK TO SAVEPOINT salary_update;
COMMIT;
```

## 8. Constraints

### 1. Create a table using PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT and CHECK.

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    salary DECIMAL(10,2) CHECK (salary >= 0),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

### 2. Create a foreign key between employees and departments.

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    department_id INT,
    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);
```

### 3. Add a foreign key to an existing table.

```sql
ALTER TABLE employees ADD CONSTRAINT fk_emp_dept FOREIGN KEY (department_id) REFERENCES departments(department_id);
```

## 9. Filtering

### 1. Find employees whose salary is between 40000 and 80000.

```sql
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 80000;
```

### 2. Find employees from departments 10, 20 or 30.

```sql
SELECT * FROM employees WHERE department_id IN (10, 20, 30);
```

### 3. Find names starting with 'A'.

```sql
SELECT * FROM employees WHERE employee_name LIKE 'A%';
```

### 4. Find employees whose email is NULL.

```sql
SELECT * FROM employees WHERE email IS NULL;
```

### 5. Find employees whose salary is not NULL.

```sql
SELECT * FROM employees WHERE salary IS NOT NULL;
```

## 10. Sorting

### 1. Sort employees by salary from highest to lowest.

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

### 2. Sort by department and then salary descending.

```sql
SELECT * FROM employees ORDER BY department_id ASC, salary DESC;
```

### 3. Find the three lowest-paid employees.

```sql
SELECT * FROM employees ORDER BY salary ASC LIMIT 3;
```

## 11. Aggregate Functions

### 1. Find the total number of employees.

```sql
SELECT COUNT(*) AS total_employees FROM employees;
```

### 2. Find the average salary.

```sql
SELECT AVG(salary) AS average_salary FROM employees;
```

### 3. Find the highest and lowest salary.

```sql
SELECT MAX(salary) AS highest_salary, MIN(salary) AS lowest_salary FROM employees;
```

### 4. Find the total salary paid by the company.

```sql
SELECT SUM(salary) AS total_salary FROM employees;
```

### 5. Count employees who have an email address.

```sql
SELECT COUNT(email) AS employees_with_email FROM employees;
```

## 12. GROUP BY

### 1. Find the number of employees in each department.

```sql
SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id;
```

### 2. Find average salary for each department.

```sql
SELECT department_id, AVG(salary) AS average_salary FROM employees GROUP BY department_id;
```

### 3. Find maximum salary in each department.

```sql
SELECT department_id, MAX(salary) AS max_salary FROM employees GROUP BY department_id;
```

## 13. HAVING

### 1. Find departments having more than 5 employees.

```sql
SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### 2. Find departments whose average salary is greater than 60000.

```sql
SELECT department_id, AVG(salary) AS average_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 60000;
```

### 3. Find departments with total salary above 500000.

```sql
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id
HAVING SUM(salary) > 500000;
```

## 14. Joins

### 1. Perform an INNER JOIN between employees and departments.

```sql
SELECT e.employee_name, d.department_name
FROM employees e
INNER JOIN departments d
ON e.department_id = d.department_id;
```

### 2. Find all departments including departments with no employees.

```sql
SELECT d.department_name, e.employee_name
FROM departments d
LEFT JOIN employees e
ON d.department_id = e.department_id;
```

### 3. Find employees who have no matching department.

```sql
SELECT e.employee_id, e.employee_name
FROM employees e
LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL;
```

### 4. Join employees with their managers using a self join.

```sql
SELECT e.employee_name AS employee,
       m.employee_name AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.employee_id;
```

### 5. Find all employee-project combinations using CROSS JOIN.

```sql
SELECT e.employee_name, p.project_name FROM employees e CROSS JOIN projects p;
```

## 15. Subqueries

### 1. Find employees earning more than the average salary.

```sql
SELECT employee_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### 2. Find the second-highest salary.

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### 3. Find employees working in the Engineering department.

```sql
SELECT employee_name
FROM employees
WHERE department_id = (
    SELECT department_id
    FROM departments
    WHERE department_name = 'Engineering'
);
```

### 4. Find departments that have at least one employee using EXISTS.

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.department_id = d.department_id
);
```

### 5. Find employees who earn the maximum salary.

```sql
SELECT employee_name, salary
FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);
```

## 16. Set Operations

### 1. Combine customer and supplier emails without duplicates.

```sql
SELECT email FROM customers UNION SELECT email FROM suppliers;
```

### 2. Combine customer and supplier emails including duplicates.

```sql
SELECT email FROM customers UNION ALL SELECT email FROM suppliers;
```

### 3. Find department IDs present in both tables.

```sql
SELECT department_id FROM employees INTERSECT SELECT department_id FROM departments;
```

### 4. Find departments that have no employees.

```sql
SELECT department_id FROM departments EXCEPT SELECT department_id FROM employees;
```

## 17. CTEs

### 1. Use a CTE to find employees earning above 80000.

```sql
WITH high_earners AS (
    SELECT employee_id, employee_name, salary
    FROM employees
    WHERE salary > 80000
)
SELECT * FROM high_earners;
```

### 2. Use a CTE to calculate department average salaries.

```sql
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT * FROM dept_avg;
```

### 3. Find employees earning more than their department average.

```sql
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT e.employee_name, e.salary, e.department_id
FROM employees e
JOIN dept_avg d ON e.department_id = d.department_id
WHERE e.salary > d.avg_salary;
```

### 4. Find an employee hierarchy using a recursive CTE.

```sql
WITH RECURSIVE employee_tree AS (
    SELECT employee_id, employee_name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.employee_id, e.employee_name, e.manager_id, t.level + 1
    FROM employees e
    JOIN employee_tree t
      ON e.manager_id = t.employee_id
)
SELECT * FROM employee_tree;
```

## 18. Window Functions

### 1. Rank employees by salary.

```sql
SELECT employee_name, salary,
       RANK() OVER (ORDER BY salary DESC) AS salary_rank
FROM employees;
```

### 2. Find the highest-paid employee in each department.

```sql
WITH ranked AS (
    SELECT employee_name, department_id, salary,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees
)
SELECT * FROM ranked WHERE rnk = 1;
```

### 3. Assign row numbers within each department.

```sql
SELECT employee_name, department_id, salary,
       ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
       ) AS row_num
FROM employees;
```

### 4. Find each employee's previous salary ordered by hire date.

```sql
SELECT employee_name, hire_date, salary,
       LAG(salary) OVER (ORDER BY hire_date) AS previous_salary
FROM employees;
```

### 5. Calculate a running salary total by department.

```sql
SELECT employee_name, department_id, salary,
       SUM(salary) OVER (
           PARTITION BY department_id
           ORDER BY hire_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM employees;
```

## 19. Views

### 1. Create a view containing active employees.

```sql
CREATE VIEW active_employees AS
SELECT employee_id, employee_name, department_id, salary
FROM employees
WHERE status = 'ACTIVE';
```

### 2. Query a view.

```sql
SELECT * FROM active_employees;
```

### 3. Drop a view.

```sql
DROP VIEW active_employees;
```

## 20. Indexes

### 1. Create an index on department_id.

```sql
CREATE INDEX idx_employees_department ON employees(department_id);
```

### 2. Create a composite index on department and salary.

```sql
CREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);
```

### 3. Create a unique index on email.

```sql
CREATE UNIQUE INDEX idx_employees_email ON employees(email);
```

### 4. Check a query execution plan.

```sql
EXPLAIN SELECT * FROM employees WHERE department_id = 10;
```

## 21. Transactions

### 1. Transfer money between two accounts atomically.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;
COMMIT;
```

### 2. Rollback a transaction when an operation should not be saved.

```sql
START TRANSACTION;
UPDATE employees SET salary = salary * 1.20 WHERE department_id = 10;
ROLLBACK;
```

### 3. Create a savepoint and roll back only later changes.

```sql
START TRANSACTION;
UPDATE employees SET salary = salary + 1000 WHERE department_id = 10;
SAVEPOINT first_change;
UPDATE employees SET salary = salary + 2000 WHERE department_id = 20;
ROLLBACK TO SAVEPOINT first_change;
COMMIT;
```

## 22. Normalization

### 1. Separate department data from employee data to reduce redundancy.

```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
```

### 2. Create a normalized order schema using separate customers, orders and products.

```sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

## 23. Stored Procedures

### 1. Create a procedure to find employees in a department. (MySQL)

```sql
DELIMITER //

CREATE PROCEDURE GetEmployeesByDepartment(IN p_department_id INT)
BEGIN
    SELECT employee_id, employee_name, salary
    FROM employees
    WHERE department_id = p_department_id;
END //

DELIMITER ;

CALL GetEmployeesByDepartment(10);
```

### 2. Create a procedure that increases salaries for a department. (MySQL)

```sql
DELIMITER //

CREATE PROCEDURE IncreaseDepartmentSalary(
    IN p_department_id INT,
    IN p_percentage DECIMAL(5,2)
)
BEGIN
    UPDATE employees
    SET salary = salary * (1 + p_percentage / 100)
    WHERE department_id = p_department_id;
END //

DELIMITER ;
```

## 24. Functions

### 1. Create a function that returns annual salary. (MySQL)

```sql
DELIMITER //

CREATE FUNCTION annual_salary(p_salary DECIMAL(10,2))
RETURNS DECIMAL(12,2)
DETERMINISTIC
RETURN p_salary * 12 //

DELIMITER ;

SELECT employee_name, annual_salary(salary) AS annual_salary
FROM employees;
```

### 2. Use a built-in function to replace NULL emails.

```sql
SELECT employee_name, COALESCE(email, 'Not Provided') AS email FROM employees;
```

### 3. Use NULLIF to avoid division by zero.

```sql
SELECT total_sales / NULLIF(order_count, 0) AS average_order_value FROM sales_summary;
```

## 25. Triggers

### 1. Create an audit trigger for deleted employees. (MySQL)

```sql
CREATE TABLE employee_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    action_type VARCHAR(20),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER employee_delete_audit
AFTER DELETE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit(employee_id, action_type)
    VALUES (OLD.employee_id, 'DELETE');
END //

DELIMITER ;
```

### 2. Prevent negative salary during insert. (MySQL)

```sql
DELIMITER //

CREATE TRIGGER validate_employee_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary cannot be negative';
    END IF;
END //

DELIMITER ;
```

## 26. Query Optimization

### 1. Find the execution plan for a frequently filtered query.

```sql
EXPLAIN SELECT employee_id, employee_name FROM employees WHERE department_id = 10;
```

### 2. Create an index to optimize department filtering.

```sql
CREATE INDEX idx_emp_department ON employees(department_id);
```

### 3. Optimize a query by selecting only required columns.

```sql
SELECT employee_id, employee_name FROM employees WHERE department_id = 10;
```

### 4. Use a composite index for department and salary filtering.

```sql
CREATE INDEX idx_dept_salary ON employees(department_id, salary);
```

### 5. Analyze an execution plan where supported.

```sql
EXPLAIN ANALYZE SELECT e.employee_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id;
```

## Most Asked SQL Interview Queries

### Find the second-highest salary
```sql
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### Find the Nth-highest salary
```sql
SELECT salary
FROM (
    SELECT DISTINCT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) x
WHERE rnk = 3;
```

### Find duplicate emails
```sql
SELECT email, COUNT(*) AS duplicate_count
FROM employees
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

### Delete duplicate records while keeping the lowest ID
```sql
DELETE e1
FROM employees e1
JOIN employees e2
  ON e1.email = e2.email
 AND e1.employee_id > e2.employee_id;
```

### Find employees earning more than their department average
```sql
SELECT e.employee_name, e.department_id, e.salary
FROM employees e
JOIN (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
) d ON e.department_id = d.department_id
WHERE e.salary > d.avg_salary;
```

### Find departments with no employees
```sql
SELECT d.department_id, d.department_name
FROM departments d
LEFT JOIN employees e
  ON d.department_id = e.department_id
WHERE e.employee_id IS NULL;
```

### Find the highest-paid employee in every department
```sql
SELECT employee_name, department_id, salary
FROM (
    SELECT employee_name, department_id, salary,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees
) x
WHERE rnk = 1;
```

### Find the top 3 salaries in each department
```sql
SELECT employee_name, department_id, salary
FROM (
    SELECT employee_name, department_id, salary,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees
) x
WHERE rnk <= 3;
```

### Find employees hired in the last 30 days
```sql
SELECT *
FROM employees
WHERE hire_date >= CURRENT_DATE - INTERVAL 30 DAY;
```

### Find the number of employees in each department
```sql
SELECT d.department_name, COUNT(e.employee_id) AS employee_count
FROM departments d
LEFT JOIN employees e
  ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;
```

### Find employees who have the same salary
```sql
SELECT e1.employee_name, e1.salary
FROM employees e1
JOIN employees e2
  ON e1.salary = e2.salary
 AND e1.employee_id <> e2.employee_id;
```

### Find employees whose salary is greater than their manager's salary
```sql
SELECT e.employee_name, e.salary, m.employee_name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m
  ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;
```

### Find the average salary by department and compare it with company average
```sql
SELECT department_id,
       AVG(salary) AS department_average,
       (SELECT AVG(salary) FROM employees) AS company_average
FROM employees
GROUP BY department_id;
```

### Find employees with no manager
```sql
SELECT employee_id, employee_name
FROM employees
WHERE manager_id IS NULL;
```

### Find the latest hired employee
```sql
SELECT *
FROM employees
WHERE hire_date = (SELECT MAX(hire_date) FROM employees);
```

### Find the oldest hired employee
```sql
SELECT *
FROM employees
WHERE hire_date = (SELECT MIN(hire_date) FROM employees);
```

### Calculate each employee's percentage contribution to total salary
```sql
SELECT employee_name,
       salary,
       salary * 100.0 / SUM(salary) OVER () AS salary_percentage
FROM employees;
```

### Find employees whose names start and end with the same letter
```sql
SELECT *
FROM employees
WHERE LOWER(LEFT(employee_name, 1)) = LOWER(RIGHT(employee_name, 1));
```

### Find monthly hiring counts
```sql
SELECT YEAR(hire_date) AS hire_year,
       MONTH(hire_date) AS hire_month,
       COUNT(*) AS employees_hired
FROM employees
GROUP BY YEAR(hire_date), MONTH(hire_date)
ORDER BY hire_year, hire_month;
```

### Find departments whose average salary is greater than 60000
```sql
SELECT department_id, AVG(salary) AS average_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 60000;
```

### Find the running total of salaries ordered by hire date
```sql
SELECT employee_name, hire_date, salary,
       SUM(salary) OVER (ORDER BY hire_date) AS running_salary
FROM employees;
```

### Find the previous employee salary using LAG
```sql
SELECT employee_name, salary,
       LAG(salary) OVER (ORDER BY hire_date) AS previous_salary
FROM employees;
```

### Find employees whose salary increased compared with the previous employee record
```sql
WITH salary_data AS (
    SELECT employee_name, hire_date, salary,
           LAG(salary) OVER (ORDER BY hire_date) AS previous_salary
    FROM employees
)
SELECT *
FROM salary_data
WHERE salary > previous_salary;
```

### Find records existing in one table but not another
```sql
SELECT department_id FROM departments
EXCEPT
SELECT department_id FROM employees;
```

### Find employees belonging to departments that exist
```sql
SELECT e.*
FROM employees e
WHERE EXISTS (
    SELECT 1
    FROM departments d
    WHERE d.department_id = e.department_id
);
```
