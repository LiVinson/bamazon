//npm package requirements
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

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
    mainMenu();
});

var bamazonDepts = ["Electronics", "Appliances", "Tools", "Outdoors"];


//Functions:
var mainMenu = function () {
    var menuOptions = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Log Out"];
    console.log("Welcome to the Bamazon Manager portal!\n");

    inquirer.prompt([{
        name: "menuSelection",
        message: "Please choose from the following options:",
        type: "list",
        choices: menuOptions
    }]).then(function (response) {

        switch (response.menuSelection) {
            case "View Products for Sale":
                viewProducts(false);
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                viewProducts(true);
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Log Out":
                endSession();
                break;
        }
    })
};



var viewProducts = function (updateInv) {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("Please see the current inventory below: \n");
            // res.forEach(function (productRow) {
            //     console.log(`Item Id: ${productRow.item_id} - ${productRow.product_name}  Price: $${productRow.price} Stock: ${productRow.stock_quantity}`);
            // });
            console.table(res);
            console.log("\n");

            if (updateInv) { //If user has requested to updated Inventory, call that function, passing in products array
                updateInventory(res);
            } else {
                inquirer.prompt([{
                    message: "What would you like to do next?:",
                    type: "list",
                    name: "userOptions",
                    choices: ["Go back to the main menu", "Log out of the manager's portal"],
                    default: "Go back to the main menu"
                }]).then(function (answer) {
                    if (answer.userOptions === "Go back to the main menu") {
                        mainMenu();
                    } else {
                        endSession();
                    }
                })
            }

        })

};

var lowInventory = function () {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.log("The following products are almost out of stock:\n")

            console.table(res);
            console.log("\n");
            inquirer.prompt([{
                message: "Would you like to reorder any products?",
                type: "list",
                choices: ["Yes, reorder now", "No, back to the main menu", "No, log out of the manager's portal"],
                default: "Yes, reorder now",
                name: "reorder"
            }]).then(function (answer) {

                switch (answer.reorder) {
                    case "Yes, reorder now":
                        viewProducts(true);
                        break;
                    case "No, back to the main menu":
                        mainMenu();
                        break;
                    case "No, log out of out the manager's portal":
                        endSession();
                        break;
                }
            })
        })
};


var updateInventory = function (itemArr) {
    inquirer.prompt([{
            message: "Please enter the item id for the product you would like to update",
            name: "updateItem",
        },
        {
            message: "How much of this item would you like to add?",
            name: "updateAmt",
            validate: function (answer) {
                if (parseInt(answer) % 1 === 0) {
                    return true
                } else {
                    return "Please enter a valid number."
                }
            },
            default: 8
        }
    ]).then(function (answer) {

        answer.updateAmt = parseInt(answer.updateAmt);

        var currStock = itemArr[answer.updateItem - 1].stock_quantity;

        console.log(`Ordering more of ${itemArr[answer.updateItem - 1].product_name}...\n`);

        setTimeout(function () {
            var query = connection.query("UPDATE products SET ? where ?", [{
                        stock_quantity: currStock + answer.updateAmt
                    },
                    {
                        item_id: answer.updateItem
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(`The stock for ${itemArr[answer.updateItem - 1].product_name} has been updated to ${currStock + answer.updateAmt}`)
                    inquirer.prompt([{
                        message: "What would you like to do next?:",
                        type: "list",
                        name: "userOptions",
                        choices: ["View an updated list of all products", "Go back to the main menu", "Log out of the manager's portal"],
                        default: "Log out of the manager's portal"
                    }]).then(function (answer) {
                        switch (answer.userOptions) {
                            case "View an updated list of all products":
                                viewProducts(false);
                                break;
                            case "Go back to the main menu":
                                mainMenu();
                                break;
                            case "Log out of the manager's portal":
                                endSession();
                                break;
                        }
                    })
                })
        }, 3000)

    })
};

var newProduct = function () {
    inquirer.prompt([{

            message: "What is the name of the new product?",
            //validation?
            name: "newProd"
        },
        {
            message: "How much of the product should be added to the inventory?",
            name: "newProdQuant",
            default: 10,
            validate: function (answer) {
                if (parseInt(answer) % 1 === 0) {
                    return true
                } else {
                    return "Please enter a valid number."
                }
            }
        },
        {
            message: "Please select the product's department:",
            type: "list",
            choices: bamazonDepts,
            name: "newProdDept"
        },
        {
            message: "How much will the product cost, including cents (i.e. 100.00)?: $",
            name: "newProdPrice",
            validate: function (val) {

                //Confirm the 2nd to last character is a decimal and rest of  characters are digits
                for (var i = 0; i < val.length; i++) {
                    if ("0123456789".indexOf(val[i]) === -1) {
                        if (i !== val.length - 3 || val[i] !== ".") {
                            return "Please enter a valid price, including cents. Do not include the dollar sign"
                        }
                    }
                }
                return true;
            }
        }
    ]).then(function (response) {
        response.newProdPrice = parseInt(response.newProdPrice).toFixed(2);
        console.log(`Adding ${response.newProdQuant} of ${response.newProd} to inventory...`)

        var query = connection.query(
            "INSERT INTO products SET?", {
                product_name: response.newProd,
                department_name: response.newProdDept,
                price: response.newProdPrice,
                stock_quantity: response.newProdQuant
            },
            function (err, res) {
                console.log(`Update complete! ${response.newProd} has been added to inventory!\n`)
                inquirer.prompt([{
                    message: "What would you like to do now?",
                    name: "userChoice",
                    type: "list",
                    choices: ["Enter another product", "Go back to the main menu", "Log out of the manager's portal"],
                    default: "Go back to the main menu"
                }]).then(function (response) {

                    switch (response.userChoice) {
                        case "Enter another product":
                            newProduct();
                            break;
                        case "Go back to the main menu":
                            mainMenu();
                            break;
                        case "Log out of the manager's portal":
                            endSession();
                            break;
                    }
                })
            })

    })

};

var endSession = function () {
    console.log("Have a great day!");
    connection.end();
}

//Next Steps:


//Update ReadMe

//Update database product names, quantities, prices

//Create video
//Turn In