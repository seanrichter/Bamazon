console.log("Hello Bamazon")

//Dependencies
var mysql = require("mysql")
var inquirer = require("inquirer")
var colors = require('colors')
var Table = require('cli-table');

//Connection
var Connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Guitarsmr1014Stella",
    database: "bamazon_db"
});

Connection.connect(function(err){
    if (err) throw err;
    console.log(colors.cyan("Welcome! ...you are now connected to theh Bamazon Store database as id " + Connection.threadId));

    bamazon();
});