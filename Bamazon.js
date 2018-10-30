var mysql = require("mysql");
var inquirer = require("inquirer");

// This NPM Package display tables in console
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "Timwestberg",

  // Your password
  password: "Dulce1352",
  database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  readProducts();
  start();
});

function start() {


}


function readProducts() {
        console.log("Selecting all products...\n");

        connection.query("SELECT * FROM products", function(err, res) {

          if (err) throw err;

          // Log all results of the SELECT statement
        //   console.log(res.RowDataPacket);
          
console.table(res)

          connection.end();
        });
      }