const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const actions = ["View all employees?", 
                "View all employees by department?", 
                "View all employees by role?",
                "View departments?",
                "View roles?", 
                "Add employee?", 
                "Add company role?", 
                "Add department?", 
                "Update Employee?"]  


const initialQuestions = [{
    type: `list`,
    name: `action1`,
    message: `What would you like to do?`,
    choices: actions
}];



const connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees_db"
});

connection.connect((err) => {
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    let x = true
    action();
});

function action() {

    inquirer
        .prompt(initialQuestions)

        .then(a => {
            let action = a.action1;

            if (action === "View all employees?"){

                connection.query('SELECT first_name, last_name, name, title, salary FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN departments ON departments.id = employee_role.department_id', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            
            if (action === "View all employees by department?"){

                connection.query('SELECT name, first_name, last_name, title, salary FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN departments ON departments.id = employee_role.department_id', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            if (action === "View all employees by role?"){

                connection.query('SELECT title, name, first_name, last_name, salary FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN departments ON departments.id = employee_role.department_id', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            if (action === "View departments?"){

                connection.query('select * from departments;', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            if (action === "View roles?"){

                connection.query('select * from employee_role;', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            if (action === "Add employee?"){

                let i=0;
                let rowArrayTitle, resultArrayTitle = [];
                connection.query('SELECT * from employee_role', (err, rows) => {
                    if (err) throw err;

                    rowArrayTitle = JSON.parse(JSON.stringify(rows));
                    rowArrayTitle.forEach(function(event){
                        resultArrayTitle[i] = rowArrayTitle[i].title;
                        i++;
                    
                    });
                });


                let rowArrayEmployee, resultArrayEmployee = [];
                connection.query('SELECT * from employee', (err, rows) => {
                    if (err) throw err;

                    i=0;
                    rowArrayEmployee = JSON.parse(JSON.stringify(rows));
                    rowArrayEmployee.forEach(function(event){
                        resultArrayEmployee[i] = rowArrayEmployee[i].first_name + ' ' + rowArrayEmployee[i].last_name;
                        i++;
                    });
                    resultArrayEmployee[i]='null'
                    //console.table(resultArrayEmployee);
                });


                    const addEmployeeData = [{
                        type: 'input',
                        name: 'employeeFirstName',
                        message: "New employee first name?"
                    },{
                        type: 'input',
                        name: 'employeeLastName',
                        message: 'New employee last name?'
                
                    }, {
                        type: 'list',
                        name: 'employeeTitle',
                        message: 'New employee title?',
                        choices: resultArrayTitle
                    }, {
                        type: 'list',
                        name: 'managerId',
                        message: 'Does this employee have a manager?',
                        choices: resultArrayEmployee
                    }];

                    //console.log(rowArray);

                    inquirer
                    .prompt(addEmployeeData)

                    .then(b => {
  
                        
                        let newEmpFirstName = JSON.stringify(b.employeeFirstName);
                        let newEmpLastName = JSON.stringify(b.employeeLastName);
                        let newEmpTitle = b.employeeTitle;
                        let newManagerId = b.managerId;

                        let indexOne = resultArrayTitle.findIndex(element => element == newEmpTitle);
                        let newEmpTitleId = indexOne+1;

                        if (newManagerId === 'null'){

                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ' + newEmpFirstName + ',' + newEmpLastName + ',' + newEmpTitleId + ', null);', (err, rows) => {
                                if (err) throw err;
                            });
                            connection.end();

                        } else {

                            let index = resultArrayEmployee.findIndex(element => element == newManagerId);
                            newManagerId = index+1;
                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ' + newEmpFirstName + ',' + newEmpLastName + ',' + newEmpTitleId + ','+ newManagerId +');', (err, rows) => {
                                if (err) throw err;
                            });
                            connection.end();

                        };
                    });    
            };

            if (action === "Add company role?"){

                let i=0;
                let rowArrayDepartment, resultArrayDepartment = [];
                connection.query('SELECT * from departments;', (err, rows) => {
                    if (err) throw err;
                
                    rowArrayDepartment = JSON.parse(JSON.stringify(rows));
                
                    rowArrayDepartment.forEach(function(event){
                        resultArrayDepartment[i] = rowArrayDepartment[i].name;
                        i++;
                    });
                    
                });

                const addRoleQuestions = [{
                    type: `input`,
                    name: `newRoleTitle`,
                    message: `Enter new employee title:`
                },{
                    type: `input`,
                    name: `newRoleSalary`,
                    message: `Enter new role salary:`
                }, {
                    type: `list`,
                    name: `newRoleDepartment`,
                    message: `what department does this new role fall under?`,
                    choices: resultArrayDepartment
                }]
                
                inquirer
                    .prompt(addRoleQuestions)

                    .then(c => {

                        let newRoleTitle = JSON.stringify(c.newRoleTitle);
                        let newRoleSalary = JSON.stringify(c.newRoleSalary);
                        let newRoleDepartment = c.newRoleDepartment

                        let index = resultArrayDepartment.findIndex(element => element == newRoleDepartment);
                        newRoleDepartment = index+1;
                        //console.log(newRoleDepartment);

                        connection.query('INSERT INTO employee_role(title,salary,department_id) VALUES ( ' + newRoleTitle + ',' + newRoleSalary + ',' + newRoleDepartment + ');', (err, rows) => {
                            if (err) throw err;
                        });

                        connection.end();
                    });
            }

            if (action === "Add department?"){

                const newDepartmentQuestions = [{
                    type: 'input',
                    name: 'newDepartmentName',
                    message: 'New department name?'
                }]

                inquirer
                    .prompt(newDepartmentQuestions)

                    .then(d => {

                        let newDepartmentName = JSON.stringify(d.newDepartmentName);

                        connection.query('INSERT INTO departments(name) VALUES (' + newDepartmentName+ ');', (err, rows) => {
                            if (err) throw err;
                        });

                        connection.end();

                    })
            }

            if (action === "Update Employee?"){
                
                let updateEmployeeArray, resultArrayEmployee = [];
                connection.query('select * from employee;', (err, rows) => {
                    if (err) throw err;

                    i=0;
                    updateEmployeeArray = JSON.parse(JSON.stringify(rows));
                    updateEmployeeArray.forEach(function(event){
                        resultArrayEmployee[i] = updateEmployeeArray[i].first_name + ' ' + updateEmployeeArray[i].last_name;
                        i++;
                    
                    });
                });

                    console.table(updateEmployeeArray);

                const updateEmployeeQuestions = [{
                    type: `list`,
                    name: `employeeToUpdate`,
                    message: `Which employee would you like to update?`,
                    choices: updateEmployeeArray
                }]

                inquirer
                    .prompt
            

            connection.end();
        }
    });
};

// let i = 0;
// let rowArray, resultArray = [];



// ,{
//     type:'list',
//     name: 'employeeDepartment',
//     message: 'New employee department?',
//     choices: resultArray

