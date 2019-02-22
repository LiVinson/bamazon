//npm package requirements
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
require("dotenv").config();

//Save mySQL configuration info from .env file

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

connection.connect(err => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  mainMenu();
});

//Functions:
const mainMenu = () => {
  const choices = [
    "View Products for Sale",
    "View Low Inventory",
    "Add to Inventory",
    "Add New Product",
    "Log Out"
  ];
  console.log("Welcome to the Bamazon Manager portal!\n");

  inquirer
    .prompt([
      {
        name: "menuSelection",
        message: "Please choose from the following options:",
        type: "list",
        choices: choices
      }
    ])
    .then(response => {
      switch (response.menuSelection) {
        case choices[0]:
          viewProducts(false);
          break;
        case choices[1]:
          lowInventory();
          break;
        case choices[2]:
          viewProducts(true);
          break;
        case choices[3]:
          newProduct();
          break;
        case choices[4]:
          endSession();
          break;
      }
    });
};

const viewProducts = updateInv => {
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    (err, res) => {
      if (err) throw err;
      console.log("Please see the current inventory below: \n");

      const formattedArr = res.map(product => {
        productObj = {
          "Product Id": product.item_id,
          Product: product.product_name,
          Price: `$${product.price}`,
          Stock: product.stock_quantity
        };
        return productObj;
      });

      console.table("Current Product Inventory", formattedArr);
      console.log("\n");

      if (updateInv) {
        //If user has requested to updated Inventory, call that function, passing in products array
        updateInventory(res);
      } else {
        const choices = [
          "Go back to the main menu",
          "Log Out of the Manager Portal"
        ];
        inquirer
          .prompt([
            {
              message: "What would you like to do next?:",
              type: "list",
              name: "userOptions",
              choices: choices,
              default: "Go back to the main menu"
            }
          ])
          .then(answer => {
            if (answer.userOptions === choices[0]) {
              mainMenu();
            } else {
              endSession();
            }
          });
      }
    }
  );
};

const lowInventory = () => {
  connection.query(
    "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5",
    (err, res) => {
      if (err) throw err;

      const formattedArr = res.map(product => {
        productObj = {
          "Product Id": product.item_id,
          Product: product.product_name,
          Stock: product.stock_quantity
        };
        return productObj;
      });
      console.log("\n");
      console.table("Products with Low Inventory", formattedArr);
      console.log("\n");

      const choices = [
        "Yes, reorder now",
        "No, back to the main menu",
        "No, log out of the manager's portal"
      ];
      inquirer
        .prompt([
          {
            message: "Would you like to reorder any products?",
            type: "list",
            choices: choices,
            default: "Yes, reorder now",
            name: "reorder"
          }
        ])
        .then(answer => {
          switch (answer.reorder) {
            case choices[0]:
              viewProducts(true);
              break;
            case choices[1]:
              mainMenu();
              break;
            case choices[2]:
              endSession();
              break;
          }
        });
    }
  );
};

const updateInventory = itemArr => {
  inquirer
    .prompt([
      {
        message:
          "Please enter the Product id for the product you would like to update",
        name: "updateItem",
        validate: input => {
          for (i = 0; i < itemArr.length; i++) {
            if (itemArr[i].item_id == input) {
              return true;
            }
          }
          return "Please enter a valid Product ID";
        }
      },
      {
        message: "How much of this item would you like to add?",
        name: "updateAmt",
        validate: input => {
          if (input % 1 === 0 && input > 0) {
            return true;
          } else {
            return "Please enter a valid number.";
          }
        },
        default: 8
      }
    ])
    .then(answer => {
      answer.updateAmt = parseInt(answer.updateAmt);
      const currStock = itemArr[answer.updateItem - 1].stock_quantity;

      console.log(
        `Ordering more of ${itemArr[answer.updateItem - 1].product_name}...\n`
      );

      connection.query(
        "UPDATE products SET ? where ?",
        [
          {
            stock_quantity: currStock + answer.updateAmt
          },
          {
            item_id: answer.updateItem
          }
        ],
        (err, res) => {
          setTimeout(function() {
            if (err) throw err;
            console.log(
              `The stock for ${
                itemArr[answer.updateItem - 1].product_name
              } has been updated to ${currStock + answer.updateAmt}`
            );
            const choices = [
              "View an updated list of all products",
              "Go back to the main menu",
              "Log out of the manager's portal"
            ];
            inquirer
              .prompt([
                {
                  message: "What would you like to do next?:",
                  type: "list",
                  name: "userOptions",
                  choices: choices,
                  default: "Log out of the manager's portal"
                }
              ])
              .then(answer => {
                switch (answer.userOptions) {
                  case choices[0]:
                    viewProducts(false);
                    break;
                  case choices[1]:
                    mainMenu();
                    break;
                  case choices[2]:
                    endSession();
                    break;
                }
              });
          }, 2500);
        }
      );
    });
};

const newProduct = () => {
  let bamazonDepts = [];
  connection.query("Select department_name from departments", (err, res) => {
    if (err) {
      console.log(
        "Hmm, looks like we're having issues with that right now. Please try again later"
      );
      mainMenu();
    }
    res.forEach(dept => {
      bamazonDepts.push(dept.department_name);
    });

    inquirer
      .prompt([
        {
          message: "What is the name of the new product?",
          name: "newProd",
          validate: input => {
            if (input.trim().length > 1 && input.trim().length < 250) {
              return true;
            } else {
              return "Please enter a product name (up to 250 characters)";
            }
          }
        },
        {
          message: "How much of the product should be added to the inventory?",
          name: "newProdQuant",
          default: 10,
          validate: input => {
            if (input % 1 === 0 && input > 0) {
              return true;
            } else {
              return "Please enter a valid number.";
            }
          },
          default: 8
        },
        {
          message: "Please select the product's department:",
          type: "list",
          choices: bamazonDepts,
          name: "newProdDept"
        },
        {
          message:
            "How much will the product cost, including cents (i.e. 100.00)?: $",
          name: "newProdPrice",
          validate: function(input) {
            //Confirm the 2nd to last character is a decimal and rest of  characters are digits
            if (input) {
              for (let i = 0; i < input.length; i++) {
                if ("0123456789".indexOf(input[i]) === -1) {
                  if (i !== input.length - 3 || input[i] !== ".") {
                    return "Please enter a valid price, including cents. Do not include the dollar sign";
                  }
                }
              }
              return true;
            } else {
              return "Please enter a valid price, including cents. Do not include the dollar sign";
            }
          }
        }
      ])
      .then(response => {
        response.newProdPrice = parseFloat(response.newProdPrice).toFixed(2);

        console.log(
          `Adding ${response.newProdQuant} of ${
            response.newProd
          } to inventory...`
        );

        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: response.newProd,
            department_name: response.newProdDept,
            price: response.newProdPrice,
            stock_quantity: response.newProdQuant,
            product_sales: 0.0
          },
          (err, res) => {
            console.log(
              `Update complete! ${
                response.newProd
              } has been added to inventory!\n`
            );

            const choices = [
              "Enter another product",
              "Go back to the main menu",
              "Log out of the manager's portal"
            ];
            inquirer
              .prompt([
                {
                  message: "What would you like to do now?",
                  name: "userChoice",
                  type: "list",
                  choices: choices,
                  default: "Go back to the main menu"
                }
              ])
              .then(response => {
                switch (response.userChoice) {
                  case choices[0]:
                    newProduct();
                    break;
                  case choices[1]:
                    mainMenu();
                    break;
                  case choices[2]:
                    endSession();
                    break;
                }
              });
          }
        );
      });
  });
};

const endSession = () => {
  console.log("Have a great day!");
  connection.end();
};
