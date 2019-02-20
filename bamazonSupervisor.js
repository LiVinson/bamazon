//npm package requirements
const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();

const SQLhost = process.env.MY_SQL_HOST;
const SQLport = process.env.MY_SQL_PORT;
const SQLuser = process.env.MY_SQL_USER;
const SQLpassword = process.env.MY_SQL_PASSWORD;
const SQLdb = process.env.MY_SQL_DB;

//Set Mysql connection
const connection = mysql.createConnection({
  host: SQLhost,
  port: SQLport,
  user: SQLuser,
  password: SQLpassword,
  database: SQLdb
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log("Welcome to the Bamazon Supervisor portal!\n");
  mainMenu();
});

const mainMenu = () => {
  const menuOptions = [
    "View Sales by Department",
    "Create a New Department",
    "Log Out"
  ];
  inquirer
    .prompt([
      {
        name: "menuSelection",
        message: "Please choose from the following options:",
        type: "list",
        choices: menuOptions
      }
    ])
    .then(response => {
      switch (response.menuSelection) {
        case menuOptions[0]:
          viewProductSales();
          break;
        case menuOptions[1]:
          addNewDept();
          break;
        case menuOptions[3]:
          endSession();
          break;
      }
    });
};

const viewProductSales = () => {
  console.log("so you want to view products");
  const query = `SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) as product_sales, (sum(p.product_sales) - d.over_head_costs) as total_profit from departments as d  INNER JOIN products as p on d.department_name = p.department_name GROUP BY d.department_name ORDER BY d.department_id`;
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
  });
  mainMenu();
};

const addNewDept = () => {
  console.log("so you want to add a new dept");
  inquirer
    .prompt([
      {
        message: "Please provide the name of the new department",
        name: "deptName"
      },
      {
        message:
          "Please enter the monthly overhead costs for the department, including cents (e.g. 3010.50)",
        name: "cost"
      }
    ])
    .then(anwser => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: anwser.deptName,
          over_head_costs: anwser.cost
        },
        function(err, res) {
          console.log("Added new department");
          console.log(res);
          //Check if super wants to add new product
          //Yes: Add new product (department_id),
          //No: Return to main menu
        }
      );
    });
};

const endSession = () => {
  console.log("Have a great day!");
  connection.end();
};
