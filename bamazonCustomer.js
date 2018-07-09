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
          message: "What is the name of the ID you want to bid on?"
        },
        {
          name: "numUnit",
          type: "input",
          message: "How many units would you like to buy?"
        }
      ])
      .then(function(answer) {
        for (var i = 0; i < results.length; i++) {
            if(results[i].product_name === answer.bamazonBid) {
                results[i].stock_quantity -= answer.numUnit;
            }
        }

        if (answer.numUnit < results[i].stock_quantity) {
            connection.query("UPDATE products SET ? WHERE ?", 
            [
                {
                    stock_quantity: answer.numUnit
                },
                {
                    product_name: answer.bamazonBid
                }
            ],
        )
        }
      });
    connection.end();
  });
}
