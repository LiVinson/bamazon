//npm package requirements
var inquirer = require("inquirer");
var mysql = require("mysql");

//Set Mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Handlez3!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainMenu();
    connection.end();

});


var mainMenu = function () {
    var menuOptions = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
    console.log("Welcome to the Bamazon Manager portal!\n");

    inquirer.prompt([{
        name: "menuSelection",
        message: "Please choose from the following options:",
        type: "list",
        choices: menuOptions
    }]).then(function (response) {

        switch (response.menuSelection) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                updateInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
        }
    })
};



var viewProducts = function (){
    console.log("View Product!")
    // -Retrieve  item id, product name, price, and stock for all items in products table
    // -prompt user to end session, or back to main menu
};

var lowInventory = function (){
    console.log("Low Inventory!");
    // -Retrieve all items in product inventory with stock < 5
    // -prompt user to end session, or back to main menu

};

var updateInventory = function (){
    console.log("update inventory!");
    // -prompt:
    //     - Which item would you like to add more inventory for?

    //     - How much more inventory would you like to have?

    // -then:
    //     - Reset the inventory of the item with matching id/name to current stock + userInventory
    //     -Log new stock
    //     -prompt user to end session, or back to main menu

};

var newProduct = function () {
    console.log("New Product!");
    // - Ask product name
    // - Ask product starting quantity
    // - Ask product department
    // - Ask product price

    // -prompt user to end session, or back to main menu
    
}

