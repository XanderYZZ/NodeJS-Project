// Requiring module
const express = require('express');
const fs = require('fs');
 
// Creating express object
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Token
token = "SECRET_PASSWORD_666";

amount_of_item = 0;
 
// Handling GET request
app.get('/', (req, res) => {
    res.send("amount of item is: " + amount_of_item);
    res.end();
})

app.get('/api/getitemsdata', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./public/items.json')));
    res.end();
});

app.post('/api/additem', (req, res) => {
    var givenToken = req.headers["api-token"];

    if (givenToken == token) {
        var item_name = req.body.item;

        amount_of_item += 1;

        console.log(amount_of_item);

        console.log(item_name);

        saveItemToPublicFolder(item_name);
    }
})

function saveItemToPublicFolder(item) {
    // Storing the JSON format data in myObject
    var data = fs.readFileSync('./public/items.json');
    console.log(data);
    var itemArray = JSON.parse(data);
    console.log(itemArray);
    
    // Defining new data to be added
    if (itemArray.hasOwnProperty(item)) {
        console.log("already has item! need to increment copies");
        itemArray[item]["copies"] += 1;
    } else {
        let newData = {
            "copies": 1
        };
        
        // Adding the new data to our object
        itemArray[item] = newData
    }
    
    // Writing to our JSON file
    var newData2 = JSON.stringify(itemArray);
    fs.writeFile('./public/items.json', newData2, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
    });
}
 
// Port Number
const PORT = process.env.PORT ||5000;
 
// Server Setup
app.listen(PORT, '0.0.0.0', function() {
    console.log('Listening to port:  ' + PORT);
});