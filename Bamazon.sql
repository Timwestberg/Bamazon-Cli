DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(75) NOT NULL,
department_name VARCHAR(75) NOT NULL,
price DECIMAL(10,2) nOT NULL,
stock_quantity INT(11) NOT NULL,
PRIMARY KEY(item_id)
);


-- This way of inserting more than one prodcut is in Activity 06/mysql
INSERT INTO products(product_name,department_name,price,stock_quantity)
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