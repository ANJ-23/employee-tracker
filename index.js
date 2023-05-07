// Imports Inquirer & MYSQL (not sure if Express is required)
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    //   Promise: bluebird
    },
    console.log(`Employee tracker initialized.`)
)

// prompts choices for user (view info, add info, update employee roles, quit program): 
// View All Departments, View All Roles, View All Employees, Add a Department, Add a Role, Add an Employee, Update an Employee Role, Quit
async function displayMainQuestions() {
    let menuChoice = await inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: [ "View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit" ],
        },
    ]);
    switch(menuChoice.mainMenu){
        case "View All Departments":
            await viewAllDeptartments();
            break;
        case "View All Roles":
            viewAllRoles();
            break;
        case "View All Employees":
            viewAllEmployees();
            break;
        case "Add a Department":
            addDepartment();
            break;
        case "Add a Role":
            await addRole();
            break;
        case "Add an Employee":
            await addEmployee();
            break;
        case "Update an Employee Role":
            await updateEmployee();
            break;
        case "Quit":
            quitProgram();
            break;
        default:
            break;
    }
}

// displays data for departments, roles, and employees - then returns to main menu
async function viewAllDeptartments() {
    db.query(
`SELECT departments.id AS id,
departments.dept_name AS department
FROM departments;`,
    function(_err, results) {
        console.log(`\n`);
        console.table(results);
        console.log(`\n\n`);
    });

    await displayMainQuestions();
}

async function viewAllRoles() {
    db.query(
`SELECT roles.id AS id,
roles.role_name AS role_title, 
departments.dept_name AS department, 
roles.role_salary as role_salary
FROM roles
LEFT JOIN departments ON roles.role_dept = departments.id;`, function(_err, results) {
        console.log(`\n`);
        console.table(results);
        console.log(`\n\n`);
    });
    await displayMainQuestions();
}

async function viewAllEmployees() {
    db.query(
`SELECT employees.id AS id,
employees.first_name AS first_name, 
employees.last_name AS last_name, 
roles.role_name AS employee_title, 
roles.role_salary AS employee_salary, 
departments.dept_name AS department, 
employees.manager AS manager
FROM employees
INNER JOIN roles ON employees.employee_title = roles.id AND employees.employee_salary = roles.id
INNER JOIN departments ON employees.employee_dept = departments.id;`, function(_err, results) {
        console.log(`\n`);
        console.table(results);
        console.log(`\n\n`);
    });
    await displayMainQuestions();
}

// add new Department - asks just for its name
async function addDepartment() {
    const newDept = await inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the new department?',
        },
    ])

    // inserts new data to the table
    db.query(
`INSERT INTO departments (dept_name)
VALUES  ("${newDept.deptName}")`, 
        function (err, results) {
            console.log(`Department "${newDept.deptName}" added.`)
        }
    );

    await displayMainQuestions();
}

// add new Role - asks for name, salary, and department
async function addRole() {
    let deptQuery = "SELECT departments.id AS id, departments.dept_name AS department FROM departments";
    let deptData;

    db.query(deptQuery, async function(err, results) {
        // maps data in seperate variable; value is the 'id' in order to correspond with SQL's foreign keys
        deptData = results.map(row => ({
            value: row.id,
            name: row.department,
        }));
        
        const newRole = await inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the new role?',
            },
            {
                type: 'number',
                name: 'roleSalary',
                message: 'How much is the salary?',
            },
            {
                type: 'rawlist',
                name: 'roleDept',
                message: 'Which department is this role in?',
                choices: deptData
            },
        ])
    
        db.query(
`INSERT INTO roles (role_name, role_dept, role_salary)
VALUES  ("${newRole.roleName}", ${newRole.roleDept}, ${newRole.roleSalary})`, // [newRole.roleName, newRole.roleDept, newRole.roleSalary]
            function (err, results) {
                console.log(`Role "${newRole.roleName}" added.`)
            }
        );

        await displayMainQuestions();
    })
}

async function addEmployee() {
    let roleQuery = 
`SELECT roles.id AS id,
roles.role_name AS role_title, 
roles.role_dept AS department, 
roles.role_salary as role_salary
FROM roles
LEFT JOIN departments ON roles.role_dept = departments.id;`;
    let roleData;

    db.query(roleQuery, async function(err, results) {
        roleData = results.map(row => ({
            value: row.id,
            name: row.role_title,
            dept: row.department,
            salary: row.role_salary,
        }));
        
        const newEmployee = await inquirer.prompt([
            {
                type: 'input',
                name: 'empFirstName',
                message: "What is the new employee's first name?",
            },
            {
                type: 'input',
                name: 'empLastName',
                message: "Last name?",
            },
            {
                type: 'rawlist',
                name: 'empRole',
                message: 'What position do they have?',
                choices: roleData
            },
            {
                type: 'input',
                name: 'empManager',
                message: "Who's their manager (leave blank if none)?",
            },
        ])
        let roleID = newEmployee.empRole;
    
        db.query(
`INSERT INTO employees (first_name, last_name, employee_title, employee_salary, employee_dept, manager)
VALUES  ("${newEmployee.empFirstName}", "${newEmployee.empLastName}", ${roleData[roleID - 1].value}, ${roleData[roleID - 1].value}, ${roleData[roleID - 1].dept}, "${newEmployee.empManager}")`, //[newEmployee.empFirstName, newEmployee.empLastName, roleData[roleID].value, roleData[roleID].salary, roleData[roleID].dept, newEmployee.empManager],
            function (err, results) {
                console.log(`Employee "${newEmployee.empFirstName} ${newEmployee.empLastName}" added.`)
            }
        );

        await displayMainQuestions();
    })
}

// updates employee's role
async function updateEmployee() {
    let roleQuery = 
`SELECT roles.id AS id,
roles.role_name AS role_title, 
roles.role_dept AS department, 
roles.role_salary as role_salary
FROM roles
LEFT JOIN departments ON roles.role_dept = departments.id;`;
    let roleData;

    let employeeQuery = 
`SELECT employees.id AS id,
employees.first_name AS first_name, 
employees.last_name AS last_name, 
roles.role_name AS employee_title, 
roles.role_salary AS employee_salary, 
departments.dept_name AS department, 
employees.manager AS manager
FROM employees
INNER JOIN roles ON employees.employee_title = roles.id AND employees.employee_salary = roles.id
INNER JOIN departments ON employees.employee_dept = departments.id;`;
    let employeeData;

    db.query(roleQuery, async function(err, results) {
        roleData = results.map(row => ({
            value: row.id,
            name: row.role_title,
            dept: row.department,
            salary: row.role_salary,
        }));

        db.query(employeeQuery, async function(err, results) {
            employeeData = results.map(row => ({
                value: row.id,
                name: row.first_name + " " + row.last_name,
            }));

            const jobChange = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'employee',
                    message: "Who's getting a job change?",
                    choices: employeeData
                },
                {
                    type: 'rawlist',
                    name: 'newRole',
                    message: 'What is their new position?',
                    choices: roleData
                },
            ])
            let updatedEmployeeID = jobChange.employee;
            let roleID = jobChange.newRole;

            console.log(updatedEmployeeID);
            console.log(roleID - 1);

            db.query(
`UPDATE employees
SET employee_title = ${roleData[roleID - 1].value}, employee_salary = ${roleData[roleID - 1].value}, employee_dept = ${roleData[roleID - 1].dept}
WHERE id = ${updatedEmployeeID};`,
                function (err, results) {
                    console.log(`Employee updated.`)
                }
            );
            await displayMainQuestions();
        })
    })
}

function quitProgram() {
    console.log("Good bye.");
    process.exit()
}
// main();
displayMainQuestions();