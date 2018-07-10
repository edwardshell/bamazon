var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",

  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  start();
});

function start() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "bamazonBid",
          type: "list",
          choices: function() {
            var choiceArr = [];
            for (var i = 0; i < results.length; i++) {
              choiceArr.push(results[i].product_name);
            }
            return choiceArr;
          },
          message: "What is the product you want to buy?"
        },
        {
          name: "numUnit",
          type: "input",
          message: "How many units would you like to buy?"
        }
      ])
      .then(function(answer) {
        var chosenProduct;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.bamazonBid) {
            chosenProduct = results[i];
          }
        }
        if (chosenProduct.stock_quantity > parseInt(answer.numUnit)) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenProduct.stock_quantity-answer.numUnit
              },
              {
                product_name: chosenProduct.product_name
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid Placed Succesfully");
              buyAgain();
            }
          );
        } else {
          console.log("Insufficient Quantity");
          start();
        }
      });
    
  });
  
}

function buyAgain() {
  inquirer.prompt({
    name: "confirm",
    type: "confirm",
    message: "Would you like to buy something else?",
    default: true,
  }).then(function(answer) {
    if (answer.confirm === true) {
      start();
    } else {
      connection.end();
    }
  })
}