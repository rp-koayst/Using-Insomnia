const express = require('express');
const mysql = require('mysql2/promise');

require('dotenv').config()

const app = express();

// make use of expression.json() middleware: enable express to process 
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', function(req, res){
    const now = new Date();
    res.send("Hello World => " + now);
});

// restaurant name (string)
// review test (string)
// rating (float)
app.post('/reviews', async function(req, res){
    const query = `INSERT INTO reviews (restaurant_name, review_text, rating) VALUES (?, ?, ?)`;
    await pool.execute(query, [
        req.body.restaurant_name,
        req.body.review_text,
        req.body.rating
    ]);
    res.sendStatus(200).send("Created successfully");
});

app.put("/reviews/:id", async function (req, res){
    const {restaurant_name, review_text, rating} = req.body;
    await pool.execute(`UPDATE reviews 
       SET restaurant_name = ?,
           review_text = ?,
           rating = ?
        WHERE id = ?
    `, [restaurant_name, review_text, rating, req.params.id]);

    res.send("Updated completed");
})

// DELETE - Delete a review
app.delete('/reviews/:id', async function (req, res) {
    await pool.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({
        "success" : true
    })
});

app.listen(8080, function() {
    console.log("Server has started")
})

// -----------------------------------------------------------

