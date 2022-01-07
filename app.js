// Requiring module
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
 
// Creating express object
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Creating DataBase Object
let db = new sqlite3.Database('./db/items.sqlite');

// Token
token = "SECRET_PASSWORD_666";
 
// Handling GET request
app.get('/', function(request, response){   
    db.all("SELECT * FROM items", function(err,rows,fields) {
        console.log(rows);
        console.log('This function will return a list of all stored items from database ' + rows);
        response.setHeader('Content-Type','application/json')
        response.send(JSON.stringify(rows));
    });
});

app.get('/api/getitemsdata', (req, res) => {
    //res.json(JSON.parse(fs.readFileSync('./public/items.json')));
    //res.end();
    db.all("SELECT * FROM items", function(err,rows,fields) {
        console.log(rows);
        console.log('This function will return a list of all stored items from database ' + rows);
        response.setHeader('Content-Type','application/json')
        response.send(JSON.stringify(rows));
    });
});

app.post('/api/additem', (req, res) => {
    var givenToken = req.headers["api-token"];

    if (givenToken == token) {
        var item_name = req.body.item;

        console.log(item_name);

        saveItemToPublicFolder(item_name);
    }
})

function saveItemToPublicFolder(item) {
    // Adding to SQLite3 DataBase
    let insertItem = 'INSERT OR IGNORE INTO items(assetId, copies) VALUES(' + item + ', 0)'
    db.run(insertItem)

    let incrementCount = 'UPDATE items SET copies = copies + 1 WHERE assetId = ' + item
    db.run(incrementCount, function(err, row) {
        console.log(err);
        console.log(row);
    });

    // OLD JSON CODE
    // Storing the JSON format data in myObject
    /*var data = fs.readFileSync('./public/items.json');
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
    });*/
}
 
// Port Number
const PORT = process.env.PORT ||5000;
 
// Server Setup
app.listen(PORT, '0.0.0.0', function() {
    console.log('Listening to port:  ' + PORT);
});
