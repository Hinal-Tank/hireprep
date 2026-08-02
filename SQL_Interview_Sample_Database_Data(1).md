# SQL Interview Practice — Sample Database Data

> MySQL-compatible sample schema and data for the SQL interview query bank.
> Run this file before running the interview queries.

## 1. Create Database

```sql
DROP DATABASE IF EXISTS sql_interview_db;
CREATE DATABASE sql_interview_db;
USE sql_interview_db;
```

## 2. Departments

```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100)
);

INSERT INTO departments (department_id, department_name, location) VALUES
(10, 'Engineering', 'Ahmedabad'),
(20, 'Human Resources', 'Mumbai'),
(30, 'Finance', 'Pune'),
(40, 'Marketing', 'Delhi'),
(50, 'Sales', 'Bengaluru'),
(60, 'Operations', 'Hyderabad'),
(70, 'Research', 'Chennai'),
(80, 'Legal', 'Mumbai'),
(90, 'Customer Support', 'Ahmedabad'),
(100, 'Administration', 'Delhi');
```

## 3. Employees

```sql
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

INSERT INTO employees
(employee_id, employee_name, email, department_id, manager_id, salary, hire_date, status)
VALUES
(101, 'Aarav Shah', 'aarav@company.com', 10, NULL, 120000, '2020-01-15', 'ACTIVE'),
(102, 'Hina Patel', 'hina@company.com', 10, 101, 95000, '2021-03-10', 'ACTIVE'),
(103, 'Riya Mehta', 'riya@company.com', 10, 101, 85000, '2022-06-20', 'ACTIVE'),
(104, 'Rahul Desai', 'rahul@company.com', 10, 101, 85000, '2023-02-12', 'ACTIVE'),
(105, 'Neha Shah', 'neha@company.com', 10, 102, 72000, '2024-04-18', 'ACTIVE'),
(106, 'Dev Patel', 'dev@company.com', 10, 102, 65000, '2025-01-05', 'ACTIVE'),
(107, 'Isha Joshi', NULL, 10, 103, 65000, '2025-07-11', 'ACTIVE'),
(108, 'Karan Mehta', 'karan@company.com', 10, 103, 58000, '2026-01-20', 'ACTIVE'),

(109, 'Priya Shah', 'priya@company.com', 20, NULL, 90000, '2020-05-10', 'ACTIVE'),
(110, 'Amit Patel', 'amit@company.com', 20, 109, 60000, '2022-08-15', 'ACTIVE'),
(111, 'Kavya Mehta', 'kavya@company.com', 20, 109, 60000, '2023-09-01', 'ACTIVE'),
(112, 'Vivek Shah', NULL, 20, 109, 45000, '2024-11-20', 'ACTIVE'),

(113, 'Rohan Desai', 'rohan@company.com', 30, NULL, 105000, '2019-07-01', 'ACTIVE'),
(114, 'Ananya Patel', 'ananya@company.com', 30, 113, 78000, '2021-12-12', 'ACTIVE'),
(115, 'Jay Shah', 'jay@company.com', 30, 113, 55000, '2024-02-20', 'ACTIVE'),

(116, 'Meera Joshi', 'meera@company.com', 40, NULL, 98000, '2020-10-10', 'ACTIVE'),
(117, 'Arjun Mehta', 'arjun@company.com', 40, 116, 70000, '2022-01-15', 'ACTIVE'),
(118, 'Simran Patel', 'simran@company.com', 40, 116, 70000, '2023-05-25', 'INACTIVE'),

(119, 'Nikhil Shah', 'nikhil@company.com', 50, NULL, 110000, '2019-03-18', 'ACTIVE'),
(120, 'Pooja Desai', 'pooja@company.com', 50, 119, 68000, '2021-06-30', 'ACTIVE'),
(121, 'Harsh Patel', 'harsh@company.com', 50, 119, 62000, '2022-09-14', 'ACTIVE'),
(122, 'Tina Shah', 'tina@company.com', 50, 119, 62000, '2023-10-05', 'ACTIVE'),

(123, 'Sahil Mehta', 'sahil@company.com', 60, NULL, 88000, '2020-11-11', 'ACTIVE'),
(124, 'Mansi Patel', 'mansi@company.com', 60, 123, 57000, '2022-04-22', 'ACTIVE'),
(125, 'Yash Shah', NULL, 60, 123, 52000, '2024-08-16', 'ACTIVE'),

(126, 'Tanvi Mehta', 'tanvi@company.com', 70, NULL, 115000, '2018-01-10', 'ACTIVE'),
(127, 'Dhruv Patel', 'dhruv@company.com', 70, 126, 82000, '2022-02-14', 'ACTIVE'),

(128, 'Ayesha Khan', 'ayesha@company.com', 80, NULL, 125000, '2017-05-01', 'ACTIVE'),
(129, 'Varun Shah', 'varun@company.com', 80, 128, 75000, '2023-03-03', 'ACTIVE'),

(130, 'Ravi Patel', 'ravi@company.com', 90, NULL, 72000, '2020-08-08', 'ACTIVE'),
(131, 'Sneha Shah', 'sneha@company.com', 90, 130, 48000, '2024-01-09', 'ACTIVE'),

(132, 'Om Mehta', 'om@company.com', 100, NULL, 65000, '2021-01-01', 'ACTIVE');
```

## 4. Customers

```sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    city VARCHAR(100)
);

INSERT INTO customers (customer_id, customer_name, email, city) VALUES
(1, 'Acme Corp', 'contact@acme.com', 'Ahmedabad'),
(2, 'Bright Solutions', 'contact@bright.com', 'Mumbai'),
(3, 'Cloud Systems', 'info@cloud.com', 'Pune'),
(4, 'Delta Retail', 'sales@delta.com', 'Delhi'),
(5, 'Elite Technologies', 'hello@elite.com', 'Bengaluru'),
(6, 'Future Works', NULL, 'Hyderabad'),
(7, 'Global Traders', 'contact@global.com', 'Chennai'),
(8, 'Hexa Industries', 'contact@hexa.com', 'Ahmedabad');
```

## 5. Suppliers

```sql
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    email VARCHAR(150)
);

INSERT INTO suppliers (supplier_id, supplier_name, email) VALUES
(1, 'Tech Supplies', 'contact@acme.com'),
(2, 'Global Components', 'supplier@global.com'),
(3, 'Prime Hardware', 'prime@hardware.com'),
(4, 'Bright Solutions', 'contact@bright.com');
```

## 6. Products

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2),
    stock INT
);

INSERT INTO products (product_id, product_name, category, price, stock) VALUES
(101, 'Laptop', 'Electronics', 75000, 20),
(102, 'Monitor', 'Electronics', 25000, 35),
(103, 'Keyboard', 'Accessories', 2500, 100),
(104, 'Mouse', 'Accessories', 1200, 150),
(105, 'Headphones', 'Accessories', 3500, 80),
(106, 'Printer', 'Electronics', 18000, 15),
(107, 'Webcam', 'Electronics', 4500, 40),
(108, 'Office Chair', 'Furniture', 12000, 25),
(109, 'Desk', 'Furniture', 15000, 18),
(110, 'Tablet', 'Electronics', 30000, 30);
```

## 7. Orders

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE,
    status VARCHAR(30),
    total_amount DECIMAL(12,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO orders
(order_id, customer_id, order_date, status, total_amount)
VALUES
(1001, 1, '2026-01-05', 'DELIVERED', 100000),
(1002, 2, '2026-01-12', 'DELIVERED', 50000),
(1003, 1, '2026-02-10', 'SHIPPED', 75000),
(1004, 3, '2026-02-15', 'DELIVERED', 30000),
(1005, 4, '2026-03-01', 'PENDING', 18000),
(1006, 5, '2026-03-12', 'DELIVERED', 120000),
(1007, 6, '2026-04-05', 'CANCELLED', 25000),
(1008, 7, '2026-04-20', 'DELIVERED', 45000),
(1009, 1, '2026-05-10', 'DELIVERED', 60000),
(1010, 8, '2026-06-01', 'SHIPPED', 90000);
```

## 8. Order Items

```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1001, 101, 1, 75000),
(1001, 103, 2, 2500),
(1001, 105, 1, 3500),
(1002, 102, 2, 25000),
(1003, 101, 1, 75000),
(1004, 110, 1, 30000),
(1005, 106, 1, 18000),
(1006, 101, 1, 75000),
(1006, 108, 2, 12000),
(1007, 102, 1, 25000),
(1008, 107, 10, 4500),
(1009, 109, 4, 15000),
(1010, 101, 1, 75000),
(1010, 104, 5, 1200);
```

## 9. Accounts

```sql
CREATE TABLE accounts (
    account_id INT PRIMARY KEY,
    customer_id INT,
    account_holder VARCHAR(100),
    balance DECIMAL(12,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO accounts (account_id, customer_id, account_holder, balance) VALUES
(1, 1, 'Acme Corp', 100000),
(2, 2, 'Bright Solutions', 75000),
(3, 3, 'Cloud Systems', 50000),
(4, 4, 'Delta Retail', 30000);
```

## 10. Projects

```sql
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    department_id INT,
    budget DECIMAL(12,2),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO projects (project_id, project_name, department_id, budget) VALUES
(1, 'Website Redesign', 10, 250000),
(2, 'Mobile Application', 10, 400000),
(3, 'Recruitment Drive', 20, 80000),
(4, 'Financial Audit', 30, 120000),
(5, 'Marketing Campaign', 40, 180000),
(6, 'Sales Automation', 50, 300000),
(7, 'Research Platform', 70, 500000);
```

## 11. Employee Audit

```sql
CREATE TABLE employee_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    action_type VARCHAR(30),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 12. Salary History

Useful for `LAG`, ranking and analytical interview questions.

```sql
CREATE TABLE salary_history (
    history_id INT PRIMARY KEY,
    employee_id INT,
    salary DECIMAL(10,2),
    effective_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO salary_history (history_id, employee_id, salary, effective_date) VALUES
(1, 102, 80000, '2023-01-01'),
(2, 102, 88000, '2024-01-01'),
(3, 102, 95000, '2025-01-01'),
(4, 103, 70000, '2023-01-01'),
(5, 103, 78000, '2024-01-01'),
(6, 103, 85000, '2025-01-01'),
(7, 105, 60000, '2024-01-01'),
(8, 105, 72000, '2025-01-01');
```
