const express = require('express');
const mysql = require('mysql2');
//const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password123',
    database: 'company'
  },
  console.log('Connected to the company database.')
);

Object.defineProperty(console, 'log', { value: console.log, writable: false, configurable: false });
var finished = false;
var timer;


const startprompt = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'options',
            message: 'Which option would you like to do?',
            choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role',
                    'End'
                ]
        }
    ])
    .then((option) => {
        const { options } = option;
        if (options === 'view all departments') {
            viewDepartmentsPromise();
            //viewDepartments();
        } else if (options === 'view all roles') {
            viewRolesPromise();
        } else if (options === 'view all employees') {
            viewEmployeesPromise();
        } else if (options === 'add a department') {
            addDepartment();
        } else if (options === 'add a role') {
            addRole();
        } else if (options === 'add an employee') {
            addEmployee();
        } else if (options === 'update an employee role') {
            updateEmployee();
        } else if (options === 'End') {
            db.end();
        };

    });
};

viewDepartments = () => {
    
    
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, rows) => {
        if (err) reject(err);
        console.table(rows);
        
        
    });
    setTimeout (startprompt, '100');
    //.then(startprompt());
    //startprompt();
    //console.log('this is working');
};
const viewDepartmentsPromise = util.promisify(viewDepartments);

viewRoles = () => {
    
    
    const sql = 'SELECT * FROM role';
    db.query(sql, (err, rows) => {
        if (err) {console.log('There was an error')};
        console.table(rows);
    });
    setTimeout (startprompt, '100');
    //console.log('this is working');
};
const viewRolesPromise = util.promisify(viewRoles);

viewEmployees = () => {
    
    
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, rows) => {
        if (err) {console.log('There was an error')};
        console.table(rows);
    });
    setTimeout (startprompt, '100');
    //console.log('this is working');
};
const viewEmployeesPromise = util.promisify(viewEmployees);

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the new department?'
        }
    ]).then(newD => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, newD.newDepartment,(err,result) => {
            if (err) throw err;
        });
        finished = true;
    });
    timer = setInterval(function() {
        if (finished === true) {
            clearInterval(timer);
            finished = false;
            startprompt();
        }
    }, 500);
};



addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'newRoleSalary',
            message: 'What is the salary of the new role?'
        },
        {
            type: 'input',
            name: 'newRoleID',
            message: 'What is the department ID of the new role?'
        }
    ]).then(newR => {
        //const roleData = [newR.newRole, newR.newRoleSalary, newR.newRoleID];
        const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;
        db.query(sql, [newR.newRole, newR.newRoleSalary, newR.newRoleID],(err,result) => {
            if (err) throw err;
        });
        finished = true;
    });
    timer = setInterval(function() {
        if (finished === true) {
            clearInterval(timer);
            finished = false;
            startprompt();
        }
    }, 500);
};


addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEFN',
            message: 'What is the first name of the new employee?'
        },
        {
            type: 'input',
            name: 'newELN',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'input',
            name: 'newERole',
            message: 'What is the role of the new employee?'
        },
        {
            type: 'input',
            name: 'newEManager',
            message: 'If it exist, what is the manager ID of the new employee?'
        }
    ]).then(newE => {
        //const roleData = [newR.newRole, newR.newRoleSalary, newR.newRoleID];
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
        db.query(sql, [newE.newEFN, newE.newELN, newE.newERole, newE.newEManager],(err,result) => {
            if (err) throw err;
        });
        finished = true;
    });
    timer = setInterval(function() {
        if (finished === true) {
            clearInterval(timer);
            finished = false;
            startprompt();
        }
    }, 500);
};



updateEmployee = () => {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, result) => {
        if (err) throw err;

        const Elist = result.map(({first_name, last_name}) => ({name: first_name + " " + last_name}))
        //console.log(result.map(({id, first_name, last_name})));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',//updEM
                message: 'Choose employee to update',
                choices: Elist
            }
        ])
        .then(update => {
            const employeeName = update.name;
            const NameAndRole = [];
            NameAndRole.push(employeeName);

            const roleSql = `SELECT * FROM role`;

            db.query(roleSql, (err, result) => {
                if (err) throw err;
                const roles = result.map(({id, title}) => ({name: title, value: id}));
                
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Choose a new role for the employee',
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    NameAndRole.push(role);
                    
                    let employeeName = NameAndRole[0];
                    NameAndRole[0] = role;
                    NameAndRole[1] = employeeName;

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    db.query(sql, NameAndRole, (err, result) => {
                        if (err) throw err;
                    })
                    finished = true;
                })
            })
        })
        timer = setInterval(function() {
            if (finished === true) {
                clearInterval(timer);
                finished = false;
                startprompt();
            }
        }, 500);
    })
}


/*
db.query(`SELECT * FROM department`, (err, rows) => {
  console.log(rows);
});

*/
startprompt();
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});