# Bamazon

A MySQL command line store that has a customer, manager, and supervisor portal. Allows users to view inventory, place orders, update stock, tracking sales and profits by department, and more.

## Requirements

To run the application, the following applications are required:

- Node.js: [Download Instructions](https://nodejs.org/en/download/)
- • MySQL (Recommended: Download MySQL Workbench GUI: [Download Instructions](https://dev.mysql.com/downloads/workbench/)

- NPM packages:
  - [Inquirer](https://www.npmjs.com/package/inquirer): Creates various types of questions to prompt user
  - [Mysql](https://www.npmjs.com/package/mysql): Used to interact with database in MySQL Workbench
  - [Console Table](https://www.npmjs.com/package/console.table): Logs data my MySQL into a table
  - [Dotenv](https://www.npmjs.com/package/dotenv): Keeps mySQL connection information local

## Setup

To run this project locally:

1. Clone the repository
2. Use `npm install` to add the dependencies
3. Copy the schema/schema.sql content and seeds/seeds.sql content into your MySQL GUI of choice to create your database, tables, and populate the tables with starter data (Feel free to edit this file to use different product and department information)
4. Create a .env file with the following text, replacing the information in quotes with your database information:

   ```MY_SQL_HOST =  ‘SQL_HOST_HERE’
   MY_SQL_PORT =  ‘SQL_PORT_HERE’
   MY_SQL_USER = ‘SQL_USER_HERE’
   MY_SQL_ PASSWORD = ‘SQL_ PASSWORD _HERE’
   MY_SQL_ DB = ‘SQL_DBNAME_HERE’

   ```

5. In your terminal, type `node customer`, `node manager`, or `node supervisor`depending on which portal you want to run

## Functionality

### Customer Portal

The Customer Portal allows users to view the current products available for sale and the price. Users are prompted to select an item for purchase and enter a quantity they would like to order. If the requested quantity is available, the stock will be updated and the customer’s total displayed. If there is not enough of the product in stock to fulfill the order the user will be prompted to select a different item for purchase.

[Check this video to see the bamazon customer portal in action:](https://CoderLi.tinytake.com/sf/MjMwNDM5OF83MDY4MzE5)

### Manager Portal

The Manager Portal allows users to view the current products available for purchase, view the products with a low inventory, update the inventory of any item, and add a new product.

[Check this video to see the bamazon manager portal in action:](https://CoderLi.tinytake.com/sf/MjMwNDQyNV83MDY4NDM3)

### Supervisor Portal

The supervisor portal allows the user to view the overhead costs,sales, and profits by department. The user can also create a new department and add products to the new department.
Authors

Video Coming Soon!

## Authors

- **Lisa Vinson** - [LiVinson](https://github.com/LiVinson)

## Interested in Building on this Project?

If this project interests you, I challenge you to keep expanding it! Some ideas:

- Add the ability for a customer to purchase multiple items in the same transaction
- Suggest a different product when there is insufficient stock to fulfill the customers order
- Add the ability to for a supervisor to see sales and profit by month product sales by month and/or year
- Add manager and supervisor authentication
- Add a front end using HTML and CSS, or even React and deploy it
