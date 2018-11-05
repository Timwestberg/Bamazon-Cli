// NPM Package || dont forget to npm install !
let mysql = require("mysql");

let inquirer = require("inquirer");


// This NPM Package display tables in console
const cTable = require('console.table');

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

    supervisor();

});


// Function that displays the operations options to the supervisor
function supervisor() {

    //Prompts the supervisor with a list of operations they can perform

    inquirer

        .prompt(

            {

                name: "operation",

                type: "list",

                message: "Hello ! \n what would you like to do?",

                choices: [

                    "View Product Sales by Department",

                    "Create New Department",
                ]

            })

        .then(function (ans) {

            // Store the operation choice of the supervisor in a variable
            let operation = ans.operation;

            // Create a switch statement to handle the chosen operation
            switch (operation) {

                case "View Product Sales by Department":

                    // IF the supervisor would like to now the sales of specific department run the sales function
                    saleDept();

                    break;

                case "Create New Department":

                    // If the supervisor would like to create a new department call the create department function
                    createDept();

                    break;
            }

        });

};


// Functions that displays all departments sales numbers including products sales and total department profit
function saleDept() {

    // Selects the table columns to operate with

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, ";

    // Subtracts department over head costs from products sales and displays to the supervisor under new table column total profit

    query += "products.product_sales - departments.over_head_costs AS total_profit FROM departments INNER JOIN products ";

    // How to join the tables correctly with corresponding department names

    query += "ON departments.department_name = products.department_name";

    connection.query(query, function (err, res) {

        if (err) throw err;

        console.table(res);

        supervisor();

    })

};


// Function that allow the supervisor to create a new department
function createDept() {


    connection.query("SELECT * FROM departments", function (err, res) {


        if (err) throw err;


        // Prompts the supervisor with questions pertaining to adding a new department
        inquirer

            .prompt([

                {

                    name: "newdept",

                    type: "input",

                    message: "What is the name of the new department?"
                },

                {
                    name: "overhead",

                    type: "input",

                    message: "What is the overhead cost for the new Department?",

                    // Confirms the value entered is a number
                    validate: function (value) {

                        if (isNaN(value) === false) {

                            return true;

                        }

                        return false;

                    },

                },

            ])

            .then(function (ans) {

                connection.query("INSERT INTO departments SET ?",

                    {

                        department_name: ans.newdept,

                        over_head_costs: ans.overhead

                    },

                    function (err, res) {

                        if (err) throw (err);

                        console.log("New department added!");

                        supervisor();

                    });

            });

    });

};