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

Connection.connect(function (err) {
    if (err) throw err;
    console.log(colors.cyan("Welcome! ...you are now connected to theh Bamazon Store database as id " + Connection.threadId));

    bamazon();
});

//Display Inventory
function bamazon() {
    Connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        
        //Cli-Table display with color
        var table = new Table(
            {
                head: ["Product ID".cyan.bold, "Product Name".cyan.bold, "Department Name".cyan.bold, "Price".cyan.bold, "Quantity".cyan.bold],
                colWidths: [12, 75, 20, 12, 12],
            });
        //Set/Style table headings and loop through inventory    
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(table.toString());

        //Customers Input
        inquirer.prompt([
            {
                type: "number",
                message: "Please enter the Product ID of the item that you would like to buy?".yellow,
                name: "id"
            },
            {
                type: "number",
                message: "How many would you like to buy?".yellow,
                name: "quantity"
            },
        ])

            //Ordering Function
            .then(function (cart) {
                var quantity = cart.quantity;
                var itemId = cart.id;

                Connection.query('SELECT * FROM products WHERE id=' + itemId, function (err, selectedItem) {
                    if (err) throw err;

                    //Verify item quantity is in inventory
                    if (selectedItem[0].stock_quantity - quantity >= 0) {
                        console.log("INVENTORY AUDIT:  Quantity in stock: ".green + selectedItem[0].product_name.yellow + "to fill your order!".green);
                        console.log("Congratulations! Bamazon has sufficient inventory of ".green + selectedItem[0].product_name + " to fill your order!".green);

                        //Calculate total sale
                        console.log("Thank you for your purchase.  Your order total will be ".green + (cart.quantity * selectedItem[0].price).toFixed(2).yellow + " dollars.".green, "\nThank you for shopping at Bamazon!".magenta);

                        //remove purchased item from inventory
                        Connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [selectedItem[0].stock_quantity - quantity, itemId],
                            function (err, inventory) {
                                if (err) throw err;

                                bamazon();
                            });
                    }
                    //Low inventory warning
                    else {
                        console.log("INSUFFICIENT INVENTORY ALERT: \nBamazon only has ".red + selectedItem[0].stock_quantity + " " + selectedItem[0].product_name.cyan + " in stock at this moment. \nPlease make another selection or reduce your quantity.".red, "\nThank you for shopping at Bamazon!".magenta);
                        bamazon();
                    }
                });
            });
    });
}