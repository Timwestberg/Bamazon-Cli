let mysql = require("mysql");
// NPM Package || dont forget to npm install !
let inquirer = require("inquirer");

// This NPM Package display tables in console
const cTable = require('console.table');

// create the connection information for the sql database
let connection = mysql.createConnection({

  // Your hosts; if not localhost
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "Timwestberg",

  // Your password
  password: "Dulce1352",

  // Selects database
  database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {


  if (err) throw err;

  // Show the user the initial set of product they have to choose from



  // run the start function after the connection is made to prompt the user
  
});




let Manager = function() {

    this.divider = console.log("\n \n");

    inquirer
  .prompt([
    {
        name: "options",
        type: "list",
        message: "What operation would you like to perform?",
        choices:["See all products","Add Stock","Add Item","Low Inventory"]
    }
    /* Pass your questions in here */
  ])
  .then(function(ans) {
    let operation = ans.options

    switch(operation) {
        case "See all products" :
        this.allProducts();
        this.again();
        break;

        case "Add Stock":
        this.addStock()
        break;

        case "Add Item":
        this.newItem()
        break;

        case "Low Inventory":
        this.lowInventory()
        break;
    }
  });

    this.allProducts = function(){

        console.log("\n Now displaying all products in stock...\n");

        // Selects all prodcuts and stores result in "res" -function param
      
        connection.query("SELECT * FROM products", function (err, res) {
      
          if (err) throw err;
      
          // Logs all products in a table for the users visual pleasure
          console.table(res)
      
          // connection.end();
        });
    };
    this.lowInventory = function () {
        console.log("\n Now displaying all products with low inventory.. \n");

        // Selects all prodcuts and stores result in "res" -function param
      
        connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5",{
        },function (err, res) {
      
          if (err) throw err;
      
          // Logs all products in a table for the users visual pleasure
          console.table(res)
      
        });
    };
    this.newItem = function() {

        this.allProducts();

        inquirer
        .prompt([
            {
            name: "name",
            type: "input",
            message: "What is the product you are adding?"
          },
          {
            name: "price",
            type: "input",
            message: "How much does this item cost?"
          },
          {
            name: "department",
            type: "list",
            message: "What department is this in?",
            choices: ["Technology","Home Decor","TV","Office Supplies"]
          },
          {
            name: "stock",
            type: "input",
            message: "How many would you like to add ?"
          }
        ])
        .then(function (answer) {

            let itemName = answer.name;

            let department = answer.department;

            let price = answer.price;

            let stock = answer.stock;
      
            this.insertItem(itemName,department,price,stock);

            this.divider;

            this.again();

        });

        };
    this.addStock = function () {

        this.allProducts();

        connection.query("SELECT * FROM products", function (err, results) {

          // Message to the Node user
          inquirer
          .prompt([{
              name: "choice",
              type: "input",
              message: "Which item would you like to add stock into "
            },
            {
              name: "amount",
              type: "input",
              message: "How much stock would you like to add?"
            }
          ])
          .then(function(answers) {

            let chosenItem = results[answers.choice - 1]

            let chosenId = chosenItem.item_id

            let oldQuantity = chosenItem.stock_quantity

            let newQuantity = parseInt(oldQuantity) + parseInt(answers.amount);

            this.updateProduct(chosenId,newQuantity);

            this.divider;
            
            this.again();
          });

        });

    };

    this.updateProduct = function(chosenId, newquantity) {

        // Message to the Node user
      
        console.log("Updating stock...\n");
      
        connection.query(
      
          "UPDATE products SET ? WHERE ?",
          [
            //  First Parameter '?'
            {
              // updates stock quantity to the updated quanitity after user purchase
      
              stock_quantity: newquantity
            },
            // Second Parameter '?'
            {
              // selects the primary key to update
      
              item_id: chosenId
            }
          ],
          function (err, results) {
      
            console.log("\n Products have been updated! \n")
      
            // To debug if table was updated or not
      
            //  console.table(results) ===
      
            // Show updated table
      
            // readProducts();
      
          }
        );
      
    };

    this.again = function() {
        inquirer
  .prompt([
    {
        name: "again",
        type: "list",
        message: "\n Would you like to perform another operation?",
        choices:["Yes","No"]
      }
  ])
  .then(function(ans) {
    let answer = ans.again;

    switch(answer) {
        case "Yes":

        manager();

        break;

        case "No":

        this.allProducts();

        connection.end();

        break;
    }
  });

    };

    this.insertItem = function(name,department,price,stock) {

        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: name,
              department_name: department,
              price: price,
              stock_quantity: stock
            },
            function(err) {
              if (err) throw err;
              console.log("Your Item was created successfully!");
              

            }

          );

    };
};

module.exports = Manager;