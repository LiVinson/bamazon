//npm package requirements
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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
  viewInventory();
});

//Display Items function
const viewInventory = function() {
  connection.query(
    "SELECT item_id, product_name, price FROM products",
    function(err, res) {
      if (err) throw err;
      console.log(`Welcome to Bamazon!\n`);
      console.log(`Checkout out our current inventory:\n`);

      console.table(res);
      console.log("");
      requestOrder(res);
    }
  );
};

//Called once viewInventory function completes
const requestOrder = function(productArr) {
  inquirer
    .prompt([
      {
        name: "itemNum",
        message:
          "Please enter the item # for the item you would like to purchase:",
        validate: function(itemNum) {
          if (
            Number.isInteger(parseInt(itemNum)) &&
            0 < parseInt(itemNum) < productArr.length
          )
            return true;
          else
            return `Please enter a item number between 1 and ${
              productArr.length
            }`;
        }
      },
      {
        name: "quantity",
        message: "How many would you like to buy (please enter a quantity):",
        validate: function(amount) {
          if (parseInt(amount) > 0) return true;
          else return "Please enter a number greater than 0 for the quanitity";
        }
      }
    ])
    .then(function(answer) {
      console.log(
        `\nConfirming stock of ${
          productArr[answer.itemNum - 1].product_name
        }s...\n`
      );

      setTimeout(function() {
        confirmStock(answer);
      }, 2000);
    });
};

const confirmStock = function(userOrder) {
  userOrder.itemNum = parseInt(userOrder.itemNum);

  connection.query(
    "SELECT * FROM products WHERE ?",
    {
      item_id: userOrder.itemNum
    },
    function(err, res) {
      if (err) throw err;
      const item = res[0];
      // const itemStock = res[0].stock_quantity;
      // const currentSales = res[0].product_sales;
      // console.log(currentSales);
      if (item.stock_quantity < userOrder.quantity) {
        insuffStock(res[0].product_name);
      } else {
        purchaseItem(item, userOrder);
      }
    }
  );
};

const insuffStock = function(prodName) {
  console.log(
    `We're sorry! We do not have enough ${prodName}s in stock to fill your order!\n`
  );
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "reorder",
        message: "Would you like to order something else?",
        default: true
      }
    ])
    .then(function(answer) {
      if (answer.reorder) {
        viewInventory();
      } else {
        console.log("Thanks for visiting! We hope you shop with us again!");
        connection.end();
      }
    });
};

const purchaseItem = function(
  { price, stock_quantity, product_sales, product_name },
  { itemNum, quantity }
) {
  const newStock = stock_quantity - quantity;
  const newSales = quantity * price + product_sales;

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStock,
        product_sales: newSales
      },
      {
        item_id: itemNum
      }
    ],
    function(err, res) {
      console.log("\nYour order is processing. Calculating your total...\n");
      if (res.changedRows) {
        setTimeout(function() {
          displayReceipt(quantity, product_name, price);
        }, 3000);
      } else {
        console.log(
          "hmm, looks like there was an issue processing your order. Please try again later"
        );
        connection.end();
      }
    }
  );
};

//Called if stock is sufficient
const displayReceipt = function(itemQuantity, itemName, itemPrice) {
  const totalAmt = itemQuantity * itemPrice;
  console.log(
    `Your total for ${itemQuantity} ${itemName}${
      itemQuantity > 1 ? "s" : ""
    } is $${totalAmt}! Your store account has been charged!\n Thank you for your purchase!\n`
  );

  inquirer
    .prompt([
      {
        message: "Would you like to place another order?",
        name: "orderAgain",
        type: "confirm"
      }
    ])
    .then(function(answer) {
      if (answer.orderAgain) {
        viewInventory();
      } else {
        console.log("\nThank you for shopping at Bamazon!");
        connection.end();
      }
    });
};
