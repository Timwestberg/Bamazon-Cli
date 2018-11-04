
let mysql = require("mysql");
// NPM Package || dont forget to npm install !
let inquirer = require("inquirer");

let Manager = require("./bamazonmanager")

// let employee = new Manager();

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
  // readProducts()

  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
  .prompt([
    {
      name: "type",
      type: "list",
      message: "Are you a Customer or Manager?",
      choices:["Customer","Manager"]
    }])
    .then(function (answer) {
      let type = answer.type;

      switch(type) {
        case "Customer":

        customer();

        break;
        case "Manager":
        new Manager();
        break;
      }

    });

}

  
function customer() {

  readProducts();

  connection.query("SELECT * FROM products", function (err, results) {

    if (err) throw (err)

    inquirer
      .prompt([
        {
          name: "choice",
          type: "input",
          message: "Select an item number to purchase"
        },
        {
          name: "amount",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function (answer) {


        //  Selects the specific item the user want to buy and puts the whoel object into a variable
        let chosenItem = results[answer.choice - 1]

        //  Price of the selected item the user would like to purchase stored in a variable
        let itemPrice = chosenItem.price;

        // Amount of stock the user would like to purchase stored in a variable
        let quanitity = answer.amount

        let purchasePrice = parseFloat(itemPrice * quanitity);




        // pulls the item's primary id out of the stored object
        let chosenId = chosenItem.item_id



        //  stores the stored quantity from stock minues the qaunitity the user would like to buy
        let newquantity = chosenItem.stock_quantity - answer.amount


        //  Check to safegaurd that the user cannot buy more prodcuts then stocks
        if (newquantity < 0) {

          console.log("Not enough in Stock!")

        } else {

          // Functions to update products plugs in chosen id and new quanitity
          updateProduct(chosenId, newquantity);

          console.log("\n Thank you for your purchase! \n" + "\n Enjoy your " + chosenItem.product_name);

          console.log("\n Your total is: $" + purchasePrice);


        }

        //  Shows what ID was selected by the user
        // console.log("Hit 1 " + chosenId)

        // Show the updated Quantity after the user's purchase
        // console.log("Hit 2 " + newquantity)

      });

  })
}



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
}


// Function to update products
function updateProduct(chosenId, newquantity) {

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

      // Show updated table

      // readProducts();

    }
  );


}








// // ==== function to calculate price =====
// function calcPrice(price,quantity) {

//   // Calculates the total for the customer
//   let total = Math.floor(price * quantity);
  
//   console.log("Your total will be " + total);
  
//   }