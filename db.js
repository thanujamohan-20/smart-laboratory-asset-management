const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ftn0192",   // change if you have password
    database: "lab_management"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

module.exports = db;