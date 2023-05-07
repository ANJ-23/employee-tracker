DROP DATABASE IF EXISTS workplace_db;
CREATE DATABASE workplace_db;

USE workplace_db;

-- departments: IDs, dept names
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 'PRIMARY KEY' indicates key to be exported
  dept_name VARCHAR(100) NOT NULL
);

-- roles: IDs, role names, department that the role belongs to
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL,
  
  -- foreign key for departments
  role_dept INT,
  FOREIGN KEY (role_dept) REFERENCES departments(id),

  role_salary INT NOT NULL
);

-- employees: IDs, first names, last names, job titles, departments, salaries, managers
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,

  -- foreign key for roles
  employee_title INT,
  FOREIGN KEY (employee_title) REFERENCES roles(id),

  employee_salary INT,
  FOREIGN KEY (employee_salary) REFERENCES roles(id),

  -- foreign key for departments
  employee_dept INT,
  FOREIGN KEY (employee_dept) REFERENCES departments(id),

/*   PRIMARY KEY (id),
  manager_id INT
  FOREIGN KEY (manager_id) REFERENCES employees(id), */
  manager VARCHAR(100)
);