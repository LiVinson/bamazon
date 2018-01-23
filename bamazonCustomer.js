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
    viewInventory();
});

//display Items function
var viewInventory = function () {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.log(`Welcome to Bamazon!`);
        console.log(`Checkout out our current inventory:\n`);
        console.log(`Item # | Product Name | Price    `);

        res.forEach(function (productRow) {
            console.log(`  ${productRow.item_id} - ${productRow.product_name}:  $${productRow.price}  `);
        })

        requestOrder(res);
        // connection.end();
    })
};

var requestOrder = function (productArr) {
    inquirer.prompt([{
        name: "itemNum",
        message: "Please enter the item # for the item you would like to purchase:",
        validate: function (itemNum) {
            if (Number.isInteger(parseInt(itemNum)) && 0 < parseInt(itemNum) < productArr.length)
                return true;
            else
                return `Please enter a item number between 1 and ${productArr.length}`;
        }

    }, {
        name: "quantity",
        message: "How much would you like to buy (please enter a quantity):",
        validate: function (amount) {
            if (parseInt(amount) > 0)
                return true;
            else
                return "Please enter a  number greater than 0 for the quanitity";
        }
    }]).then(confirmStock)
};

var confirmStock = function (userOrder) {
    console.log(`We need to confirm our stock to see if we have ${userOrder.quantity} of that product! We'll get back to you`);
    console.log(`Item number is ${userOrder.itemNum}`);

    userOrder.itemNum = parseInt(userOrder.itemNum);


    connection.query("SELECT * FROM products WHERE ?", {
            item_id: userOrder.itemNum
        },
        function (err, res) {
            if (err) throw err;
            console.log(res);
            var itemStock = res[0].stock_quantity;
            console.log(`There are currently ${itemStock} ${res[0].product_name}s in stock!`)
            if (itemStock < userOrder.quantity) {
                insuffStock(userOrder.quantity, res[0].product_name);
            } else {
                var newStock =itemStock - userOrder.quantity;
                console.log(newStock);
                updateStock(userOrder, newStock);
            }
        })

}

var insuffStock = function (amount, prodName) {
    console.log(`We're sorry! Currently, we do not have enough ${prodName}s in stock!`);
    inquirer.prompt([{
        type: "confirm",
        name: "reorder",
        message: "Would you like to take another look at our inventory and try ordering again?",
        default: true
    }]).then(function (answer) {
        if (answer.reorder) {
            viewInventory();
        } else {
            console.log("Thanks for visiting! We hope you shop with us again!");
            connection.end();
        }
    })
};

var updateStock = function (order, newStock) {
    console.log("We have enough of that!");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                item_id: order.itemNum
            }
        ],
        function(err, res) {
            console.log(res);

            console.log("Order processed!");
            purchase();

        }
    )

    var purchase = function(){
        console.log("Purchase prince pending!")
    }
    //Update the stock (and log)

    //Calculate the price and log

    //Ask to make another purchase

    connection.end();
}
// )





/*  Locate item in products table that has item that matches user input
    Compare stock of that item to amoutn user wants to order
    If stock > amount ordered: place order()
    If stock < amount ordered - lowStock()
*/
// }