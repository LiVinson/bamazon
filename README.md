# Bamazon
Amazon-like storefront using MySQL that includes a customer portal for customers to place orders that depletes stock from the store's inventory and a manager's portal to check inventory, update inventory, and add new products for sale.

## Requirements
To run the application, the following applications are required:

* Node.js: [Download Instructions](https://nodejs.org/en/download/)
* MySQL Workbench: [Download INstructions](https://dev.mysql.com/downloads/workbench/)

* NPM packages: 
   
    * [Inquirer](https://www.npmjs.com/package/inquirer): Used to create menu prompts to user
    * [Mysql](https://www.npmjs.com/package/mysql): Used to interact with database in MySQL Workbench inside of javascript files
    * [Console Table](https://www.npmjs.com/package/console.table): Used to log data my MySQL into a table
    * [Dotenv](https://www.npmjs.com/package/dotenv): Used to keep mySQL password used in Mysql npm local


## Setup

Once the bamazon repo is cloned locally and any requirements installed using `npm install` in the command line, the following need to be completed:

    * Create a .env file. In it, type in `MY_SQL_PASSWORD=your_mySQL_pw_here`, replacing "your_mySQL_pw_here" with the your mySQL Workbench password

    * Copy and paste the contents of the bamazonCustomer.sql file into MySQL Workbench to add the products database.

### Bamazon Customer Portal

The bamazonCustomer.js file allows user to view the current products available for sale, the department and the price. Users are then prompted to select an item and quanitity for order. Once selected, if the requested amount is available, it wil be subtracted from the stock and the coustomer shows their total. If the requested amount exceeds the current stock, the user will be prompted to select a different item for purchase.

[Check this video to see the bamazon customer portal in action:] (https://CoderLi.tinytake.com/sf/MjMwNDM5OF83MDY4MzE5)

### Bamazon Manager Portal

The bamazonManager.js file allows users to view the current products in the products database, view the products with a low inventory, update the inventory of any item, and add a new product to the product table.


[Check this video to see the bamazon manager portal in action:] (https://CoderLi.tinytake.com/sf/MjMwNDM5OF83MDY4MzE5)

### Bamazon Supervisor Portal

Coming Soon!

### Authors

* **Lisa Vinson** - [LiVinson](https://github.com/LiVinson)


