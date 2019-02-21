//npm package requirements
const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();
const cTable = require("console.table");

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
          addNewDepartment();
          break;
        case menuOptions[2]:
          endSession();
          break;
      }
    });
};

const viewProductSales = () => {
  const query = `SELECT d.department_id, d.department_name, d.over_head_costs, IFNULL(sum(p.product_sales), 0) as product_sales, IFNULL((sum(p.product_sales) - d.over_head_costs), 0) as total_profit from departments as d  LEFT JOIN products as p on d.department_name = p.department_name GROUP BY d.department_name ORDER BY d.department_id`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    const productArr = createProductSalesTable(res);
    console.table("Costs, Sales, and Profits by Department", productArr);
    setTimeout(mainMenu, 2000);
  });
};

const createProductSalesTable = departmentArr => {
  const mappedDeptArr = departmentArr.map(dept => {
    const deptObj = {
      Department: dept.department_name,
      "Overhead Costs": `$${dept.over_head_costs}`,
      "Product Sales": `$${dept.product_sales}`,
      Profit: `$${dept.total_profit}`
    };

    return deptObj;
  });

  return mappedDeptArr;
  console.table("Costs, Sales, and Profits by Department", mappedDeptArr);
};

const addNewDepartment = () => {
  inquirer
    .prompt([
      {
        message: "Please provide the name of the new department",
        name: "deptName",
        validate: input => {
          if (input.trim().length > 0 && input.trim().length < 30) {
            return true;
          } else {
            return "Please enter a department name between 1 and 30 characters";
          }
        }
      },
      {
        message:
          "Please enter the monthly overhead costs for the department, including cents (e.g. 3010.50)",
        name: "cost",
        validate: input => {
          //Confirms the 2nd to last character is a decimal and rest of  characters are digits
          if (input) {
            for (let i = 0; i < input.length; i++) {
              if ("0123456789".indexOf(input[i]) === -1) {
                if (i !== input.length - 3 || input[i] !== ".") {
                  return "Please enter a valid price, including cents. Do not include a dollar sign or comma";
                }
              }
            }
            return true;
          } else {
            return "Please enter a valid price, including cents. Do not include a dollar sign or comma";
          }
        }
      }
    ])
    .then(answer => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.deptName.trim(),
          over_head_costs: answer.cost
        },
        (err, res) => {
          if (res.affectedRows) {
            inquirer
              .prompt([
                {
                  message: `The ${
                    answer.deptName
                  } department has been added! Would you like to add a product to the new department now?`,
                  name: "addProduct",
                  type: "confirm"
                }
              ])
              .then(response => {
                if (response.addProduct) {
                  addProductToNewDepartment(answer.deptName);
                } else {
                  mainMenu();
                }
              });
          } else {
            console.log(
              "hmm, looks like we had an issue adding that department. Please try again later."
            );
          }
        }
      );
    });
};

const addProductToNewDepartment = deptName => {
  inquirer
    .prompt([
      {
        message: `What is the name of the new product to be added to the ${deptName} department?`,
        //validation?
        name: "newProd",
        validate: input => {
          const inputLength = input.trim().length;
          if (inputLength > 0 && inputLength < 51) {
            return true;
          } else {
            return "The product name must be between 1 and 50 characters";
          }
        }
      },
      {
        message: "How much of the product should be added to the inventory?",
        name: "newProdQuant",
        default: 10,
        validate: input => {
          if (!(parseInt(input) % 1 === 0)) {
            return "Please enter a valid number.";
          } else if (input > 100000) {
            return "Only up to 100,000 products can be added at a time. Please enter a valid amount";
          } else {
            return true;
          }
        }
      },
      {
        message:
          "How much will the product cost, including cents (i.e. 100.00)?: $",
        name: "newProdPrice",
        validate: input => {
          if (input) {
            for (let i = 0; i < input.length; i++) {
              if ("0123456789".indexOf(input[i]) === -1) {
                if (i !== input.length - 3 || input[i] !== ".") {
                  return "Please enter a valid price, including cents. Do not include the dollar sign or comma.";
                }
              }
            }
            return true;
          } else {
            return "Please enter a valid price, including cents. Do not include the dollar sign or comma.";
          }
          //Confirms the 2nd to last character is a decimal and rest of  characters are digits
        }
      }
    ])
    .then(answer => {
      const productPrice = parseFloat(answer.newProdPrice).toFixed(2);
      const newProdQuant = answer.newProdQuant.replace(",", "");
      setTimeout(
        console.log(
          `Adding ${newProdQuant} of ${answer.newProd} to inventory...`
        ),
        1500
      );
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.newProd.trim(),
          department_name: deptName,
          price: productPrice,
          stock_quantity: newProdQuant,
          product_sales: 0.0
        },
        (err, res) => {
          if (res && res.affectedRows) {
            console.log(
              `Update complete! ${
                answer.newProd
              } has been added to inventory!\n`
            );

            inquirer
              .prompt({
                message: `Would you like to add another product to the the ${deptName} department?`,
                name: "addProduct",
                type: "confirm"
              })
              .then(response => {
                if (response.addProduct) {
                  addProductToNewDepartment(deptName);
                } else {
                  mainMenu();
                }
              });
          } else {
            console.log(err);
          }
        }
      );
    });
};

const endSession = () => {
  console.log("Have a great day!");
  connection.end();
};
