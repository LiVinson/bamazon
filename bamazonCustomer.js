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

    })
};

//Called once viewInventory function completes
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
        message: "How many would you like to buy (please enter a quantity):",
        validate: function (amount) {
            if (parseInt(amount) > 0)
                return true;
            else
                return "Please enter a number greater than 0 for the quanitity";
        }
    }]).then(function (answer) {


        console.log(`\nConfirming stock of  ${productArr[answer.itemNum-1].product_name}s...\n`);

        setTimeout(function () {

            confirmStock(answer)
        }, 2000);
    });
};

var confirmStock = function (userOrder) {
    userOrder.itemNum = parseInt(userOrder.itemNum);

    connection.query("SELECT * FROM products WHERE ?", {
            item_id: userOrder.itemNum
        },
        function (err, res) {
            if (err) throw err;
            // console.log(res);
            var itemStock = res[0].stock_quantity;
            console.log(`There are currently ${itemStock} ${res[0].product_name}s in stock!`)
            if (itemStock < userOrder.quantity) {
                insuffStock(userOrder.quantity, res[0].product_name);
            } else {
                updateStock(userOrder, itemStock);
            }
        })
};

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

var updateStock = function (order, currentStock) {
    var newStock = currentStock - order.quantity;
    // console.log(`We have ${newStock} left of that!`);
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            },
            {
                item_id: order.itemNum
            }
        ],
        function (err, res) {
            console.log("\nYour order is processing. Calculating final price...!\n");
            setTimeout(function () {

                purchaseItem(order);

            }, 3000)
        }
    )
};

//Called if stock is sufficient
var purchaseItem = function (userOrder) {
    // console.log(userOrder.itemNum);
    connection.query("SELECT price,product_name,stock_quantity FROM products WHERE ?", {
            item_id: userOrder.itemNum
        },
        function (err, res) {
            if (err) throw err;

            var totalAmt = (res[0].price * userOrder.quantity);
            console.log(`Your total for ${userOrder.quantity} ${res[0].product_name}s is $${totalAmt}! Your store account has been charged!`);
            // console.log(res);
            connection.end();
        })
}