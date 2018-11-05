// Package for MySql so that app can connect to database
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


  // run the start function after the connection is made to prompt the customer
  customer();

});

// Function to prompt the user with the available items in stock and ask what they would like to purchase
function customer() {

  // Run function to show customer products
  readProducts();

  connection.query("SELECT * FROM products", function (err, results) {

    if (err) throw (err)


    // Ask what the user would like to purchase and how many
    inquirer
      .prompt([
        {
          name: "choice",

          type: "input",

          message: "Select an item number to purchase",

          validate: function (val) {

            if (isNaN(val) === false && parseInt(val) > 0 && parseInt(val) <= 100) {

                return true;

            }

            return "Please choose a valid ID";

        }

        },

        {

          name: "amount",

          type: "input",

          message: "How many would you like to buy?",

          validate: function (val) {

            if (isNaN(val)) {

                return "Please choose a number quantity"

            } else {

                return true
            }

          }
        }

      ])

      .then(function (answer) {


        //  Selects the specific item the user want to buy and puts the whoel object into a variable
        let chosenItem = results[answer.choice - 1];

        //  Price of the selected item the user would like to purchase stored in a variable
        let itemPrice = chosenItem.price;

        // Amount of stock the user would like to purchase stored in a variable
        let quanitity = answer.amount;


        // Variable that stores the purchase price for the customer to display later 
        let purchasePrice = parseFloat(itemPrice * quanitity);


        let currentSales = chosenItem.product_sales;

        // pulls the item's primary id out of the stored object
        let chosenId = chosenItem.item_id;



        //  stores the stored quantity from stock minues the qaunitity the user would like to buy
        let newquantity = chosenItem.stock_quantity - answer.amount;


        //  Check to safegaurd that the user cannot buy more prodcuts then stocks
        if (newquantity < 0) {

          console.log("Not enough in Stock!")

        } else {

          // Functions to update products plugs in chosen id and new quanitity
          updateProduct(chosenId, newquantity, purchasePrice, currentSales);

          console.log("\n Thank you for your purchase! \n" + "\n Enjoy your " + chosenItem.product_name);

          console.log("\n Your total is: $" + purchasePrice);

        

        }

        //  Shows what ID was selected by the user
        // console.log("Hit 1 " + chosenId)

        // Show the updated Quantity after the user's purchase
        // console.log("Hit 2 " + newquantity)

      });

  })
};



// Function to read the products in stock
function readProducts() {

  console.log("\n Now displaying all products in stock...\n");

  // Selects all prodcuts and stores result in "res" -function param

  connection.query("SELECT * FROM products", function (err, res) {

    if (err) throw err;

    // Logs all products in a table for the users visual pleasure
    console.table(res)

    // connection.end();
  });
};


// Function to update products
function updateProduct(chosenId, newquantity, purchaseTotal, currentSales) {

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

      // ====// console.table(results) ======//


      
// Calling the function here asks after the purchase has been completed and the products have been updated, avoiding the question showing twice as well.

    }
  );

  connection.query("UPDATE products SET ? WHERE ?", [

    //  First Parameter '?'
   {
        // updates product sales after the user's purchase

      product_sales: currentSales + purchaseTotal
    
    },
      // Second Parameter '?'
      {
        // selects the primary key to update
      item_id: chosenId
    
    }
], function (err, res) {

    if (err) throw err;

    console.log("product sales updated!");

    again();
}

);


};

// Function to run the customer purchase program again
function again() {
  inquirer
.prompt([
{
  name: "again",
  type: "list",
  message: "Would you like to make another purchase?",
  choices:["Yes","No"]
}
])
.then(function(ans) {
let answer = ans.again;

switch(answer) {
  case "Yes":

  customer();


  break;

  case "No":

  console.log("Have a great Day!")

  connection.end();

  break;
}
});

};
