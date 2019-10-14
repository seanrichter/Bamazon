DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products
(
id INT(11) not null AUTO_INCREMENT,
product_name varchar(100) not null,
department_name VARCHAR(45) default null,
price decimal(10,2) default null,
stock_quantity int(100) default null,
PRIMARY KEY (id)
);