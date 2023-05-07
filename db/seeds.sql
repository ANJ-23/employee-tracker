INSERT INTO departments (id, dept_name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Sales"),
       (4, "Legal");

INSERT INTO roles (id, role_name, role_dept, role_salary)
VALUES  (1, "Sales Lead", 3, 100000),
        (2, "Salesperson", 3, 80000),
        (3, "Lead Engineer", 1, 150000),
        (4, "Software Engineer", 1, 120000),
        (5, "Account Manager", 2, 160000),
        (6, "Accountant", 2, 125000),
        (7, "Legal Team Lead", 4, 250000),
        (8, "Lawyer", 4, 190000);
       
INSERT INTO employees (id, first_name, last_name, employee_title, employee_salary, employee_dept, manager)
VALUES  (1, "Jim", "Stanley", 1, 1, 3, ""),
        (2, "Marty", "McFly", 2, 2, 3, "Jim Stanley"),
        (3, "Mary", "Jane", 3, 3, 1, ""),
        (4, "Guy", "Dangerous", 4, 4, 1, "Mary Jane"),
        (5, "Homer", "Simpson", 5, 5, 2, ""),
        (6, "Clark", "Kent", 6, 6, 2, "Homer Simpson"),
        (7, "Robo", "Cop", 7, 7, 4, ""),
        (8, "Lisa", "Simpson", 8, 8, 4, "Robo Cop");