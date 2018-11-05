
-- Create database and ensures you dont duplicate a database
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

-- ====================================================


-- Creates a table for products to be stored

CREATE TABLE products(

item_id INT NOT NULL AUTO_INCREMENT,

product_name VARCHAR(75) NOT NULL,

department_name VARCHAR(75) NOT NULL,

price DECIMAL(10,2) NOT NULL,

stock_quantity INT(11) NOT NULL,

product_sales INT DEFAULT 0,

PRIMARY KEY(item_id)
);

-- ==============================================

-- Creates a table for departments and their overhead costs

CREATE TABLE departments (

    department_id INT NOT NULL AUTO_INCREMENT,

    department_name VARCHAR(150) NOT NULL,

    over_head_costs INT(11) DEFAULT 0,

    PRIMARY KEY (department_id)

);


-- Inserts  products into the table to start the database

INSERT INTO products(product_name,department_name,price,stock_quantity)

-- This way of inserting more than one prodcut is in Activity 06/mysql

VALUES("Iphone 8 plus Case","Technology",25.99,100),

("Galaxy S8+ Case","Technology",23.00,90),

("Exotic BackYard Lounge Set","Home Decor",1299.99,30),

("Plain Backyard Lounge Set","Home Decor",299.99,80),

("Large Umbrella","Home Decor",50.00,120),

("Small Umbrella","Home Decor",25.00,200),

("Sword Art Online Bundle","TV",29.99,75),

("The Seven Deadly Sins(Season 1)","TV",9.99,45),

("Scooby-Doo Bundle","TV",20,50),

("Paper 8x10 (500 Sheets)","Office Supplies",5.99,250),

("Printer Cartridges (Large)","Office Supplies",25,200),

("Printer Cartridges (Small)","Office Supplies",15,250);


-- Inserts departments and over head costs to begin the table

INSERT INTO departments (department_name, over_head_costs)

-- This way of inserting more than one prodcut is in Activity 06/mysql

VALUES ("Technology", 1200), 

("TV", 600), 

("Home Decor", 2500),

("Office Supplies", 1000);