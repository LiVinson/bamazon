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

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    viewInventory();
  });

  //display Items function
  var viewInventory = function(){
      connection.quert("SELECT item_id, product_name, price FROM products", function(err, res){
          if (err) throw err;
          console.log(res)
          connection.end();
      })



    
  }


  //Place order function