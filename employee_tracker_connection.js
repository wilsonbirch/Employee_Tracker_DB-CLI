const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const actions = ["View all employees?", 
                "View all employees by department?", 
                "View all employees by role?", 
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

                connection.query('SELECT name, first_name, last_name, title, salary FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN departments ON departments.id = employee_role.department_id', (err, rows) => {
                    if (err) throw err;
                    console.table(rows);
                    connection.end();
                    
                });
            }

            //if (action === "Add employee?"){

                ///let i =0;
                //let rowArray, resultArray = [];

                ///connection.query('SELECT * from departments;', (err, rows) => {
                    //if (err) throw err;
                    //rowArray = JSON.parse(JSON.stringify(rows));

                    //rowArray.id.forEach(
                        //console.log(rowArray)
                    ////)
                    //console.log(resultArray);
                    //connection.end();
                /////});

                const addEmployeeData = [
                    {
                        type: 'input',
                        name: 'employeeFirstName',
                        message: "New employee first name?"
                    },{
                        type: 'input',
                        name: 'employeeLastName',
                        message: 'New employee last name?'
                
                    }, {
                        type: 'input',
                        name: 'employeeTitle',
                        message: 'New employee title?'
                    },{
                        type: 'input',
                        name: 'employeeSalary',
                        message: 'New employee salary?'
                    },{
                        type:'list',
                        name: 'employeeDepartment',
                        message: 'New employee department?'
                        
                    }]
                    

                //inquirer
                    //.prompt(addEmployeeData)

                    //.then(a=> {
                        
                        //let newEmpFirst = a.employeeFirstName;
                        //let newEmpLast = a.employeeLastName;
                        //let newEmpTitle = a.employeeTitle;
                        //let newEmpSal = a.employeeSalary;

                        //connection.query('SELECT name, first_name, last_name, title, salary FROM employee INNER JOIN employee_role ON employee_role.id = employee.role_id INNER JOIN departments ON departments.id = employee_role.department_id', (err, rows) => {
                        //if (err) throw err;
                        //console.table(rows);
                        //connection.end();
                        //connection.end();
                //});

                //connection.end();
            //});
        //}

    });

}