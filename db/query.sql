-- SELECTING & ASSIGNING DEPARTMENTS TABLE
SELECT departments.id AS id,
departments.dept_name AS department
FROM departments;

-- SELECTING & ASSIGNING ROLE TABLE
SELECT roles.id AS id, 
roles.role_name AS role_title, 
departments.dept_name AS department, 
roles.role_salary as role_salary
FROM roles
LEFT JOIN departments ON roles.role_dept = departments.id;

-- SELECTING & ASSIGNING EMPLOYEE TABLE
SELECT employees.id AS id,
employees.first_name AS first_name, 
employees.last_name AS last_name, 
roles.role_name AS employee_title, 
roles.role_salary AS employee_salary, 
departments.dept_name AS department, 
employees.manager AS manager
FROM employees
INNER JOIN roles ON employees.employee_title = roles.id AND employees.employee_salary = roles.id
INNER JOIN departments ON employees.employee_dept = departments.id;
