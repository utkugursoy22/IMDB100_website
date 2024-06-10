const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'anakin18',
    database: 'webfinal'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MYSQL CONNECTED');
});

module.exports = db;
