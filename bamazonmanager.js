// NPM Package || dont forget to npm install !
let mysql = require("mysql");
let inquirer = require("inquirer");

// This NPM Package display tables in console
const cTable = require('console.table');

// Divider to split up information if needed
let divider = console.log("\n \n");

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


ManagerStart();  

});


// Function That prompts the Manager with initial options
function ManagerStart() {

  // Prompts the Manager with an intital set of questions asking which operation they would like to perform
    inquirer

    .prompt([

      {

          name: "options",

          type: "list",

          message: "What operation would you like to perform?",

          choices:["See all products","Add Stock","Add Item","Low Inventory"]

      }

    ])


    .then(function(ans) {

      // Stores the Manager operation selection into a variable
      let operation = ans.options
  
      // Switch statement to handle which operation the Manager selected
      switch(operation) {

          case "See all products" :

          allProducts()

          break;
  
          case "Add Stock":

          divider

          addStock()

          break;
  
          case "Add Item":

          divider

          newItem()

          break;
  
          case "Low Inventory":

          divider

          lowInventory()

          break;

      }

    });
  

};


// Function the show the Manager all products in stock
function allProducts() {

        console.log("Now displaying all products in stock...");

        // Selects all prodcuts and stores result in "res" -function param
        connection.query("SELECT * FROM products", function (err, res) {
      
          if (err) throw err;
      
          // Logs all products in a table for the users visual pleasure
          console.table(res)
      


          // Asks the Manager if they would like to perform another operation
          again();

        });
    
};


// Function that display all products that have inventory under 50 units
function lowInventory(){

        console.log("\n Now displaying all products with low inventory.. \n");

        // Selects all prodcuts and stores result in "res" -function param
      
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 50 ORDER BY stock_quantity DESC",{
        },function (err, res) {
      
          if (err) throw err;
      
          // Logs all products in a table for the users visual pleasure
          console.table(res)
      

          // Asks the Manager if they would like to perform another operation
          again();
        });
};


// Function that allow the Manager to add a new item into the database
function newItem() {


  connection.query("SELECT * FROM products", function (err, res) {

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

            type: "input", // When trying to run choice function I had this set to 'list'

            message: "What department is this in?",

    // Attempted to pull all departments into an array to display to user, this way accounts for departments later added by supervisor || When i run choices function only displays Technology for the department.


          //   choices: function() {
          //   let departments =[];
          //   for (let i = 0 ; i < res.length; i++) {

          //     departments.push(res[i].department_name);


          //     console.log(res[i]);

          //     return departments;
          //   }
          // }

    // ====================================================================================
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
      
            insertItem(itemName,department,price,stock);

            divider;

            again();

        });

      });

};


// Function that allows that Manager to add additional stock into the database
function addStock() {

        connection.query("SELECT * FROM products", function (err, results) {

          // Message to the manager
          inquirer

          .prompt([
            
            {
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

            // Variable for storing selected products to handle
            let chosenItem = results[answers.choice - 1]

            // Variable for storing select product Id
            let chosenId = chosenItem.item_id

            // Variable for storing selected product quantity in stock
            let oldQuantity = chosenItem.stock_quantity

            // Variable for storing new qaunitit || old quant plus amount manager is adding
            let newQuantity = parseInt(oldQuantity) + parseInt(answers.amount);

            // Run the update function by plugging in the chosen ID variable and New calc quantity
            updateProduct(chosenId,newQuantity);

            divider;
            
            // Asks if the manager would like to perform another operation.
            again();
          });

        });

};


// Function that updates the database with the new stock || Used in the add stock function
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
            //  console.table(results) ===
          again();
      
          }
        );
      
};

// Function that prompts the manager if they would like to perform another operation
function again() {

  inquirer

  .prompt([

    {
        name: "again",

        type: "list",

        message: "Would you like to perform another operation?",

        choices:["Yes","No"]

      }

  ])

  .then(function(ans) {

    let answer = ans.again;

    switch(answer) {

        case "Yes":

        ManagerStart();

        break;

        case "No":

        connection.end();

        break;
    }

  });

};


// Function that inserts a new item into the table || Used in the new item function
function insertItem(name,department,price,stock) {

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
              

              again();

            }

          );

};
        
    






