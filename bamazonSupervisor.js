//npm package requirements
var inquirer = require("inquirer");
var mysql = require("mysql");
require("dotenv").config();

//Saves mySQL password from .env file
var myPassword = process.env.MY_SQL_PASSWORD;

//Set Mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: myPassword,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
   //mainMenu();
});

/*var mainMenu = function() {
    (inquirer prompt): Would you like to:
        -View Product Sales by Department: ProdSalesByDept()
        -Create New Department: newDept()

}*/

/*
var ProdSalesByDept = function() {
    Query - display department id and department name, and overhead from dept table + product sales from produce table + calculated profit
        -Research aliases
        -Add console table npm

}

var newDept = function() {

    Inquirer: Name of the department, overhead cost of the departent

    Query: Update department table
        -Confirm this will update department array in manager file when adding new product

}
*/