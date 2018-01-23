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



var viewProducts = function () {
    console.log("View Product!")
    // -Retrieve  item id, product name, price, and stock for all items in products table
    // -prompt user to end session, or back to main menu

    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            res.forEach(function (productRow) {
                console.log(`Item Id: ${productRow.item_id} - ${productRow.product_name}  Price: $${productRow.price} Stock: ${productRow.stock_quantity}`);
            });
            console.log("\n");
            endSession();
        })
};

var lowInventory = function () {
    console.log("Low Inventory!");

    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.log("Items with Low Inventory:")
            console.log("____________________________")
            res.forEach(function (productRow) {
                console.log(`${productRow.item_id} - ${productRow.product_name} - Quantity: ${productRow.stock_quantity}`)
            });
            console.log("\n");
            inquirer.prompt([{
                message: "Would you like to reorder any products?",
                type: "confirm",
                default: true,
                name: "reorder"
            }]).then(function (answer) {
                if (answer.reorder) {
                    updateInventory();
                } else {
                    console.log("No problem! Please make sure to place a new order soon");
                    endSession();
                }
            })
        })
};

var updateInventory = function () {
    console.log("update inventory!");
    connection.end();
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

};

var endSession = function () {
    inquirer.prompt([{
        type: "confirm",
        message: "Would you like to log out of the manager portal?",
        name: "endSession",
        default: true

    }]).then(function (response) {
        if (response.endSession) {
            console.log("Have a great day!")
            connection.end();
        } else {
            mainMenu();
        }
    })
}