const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log('MySQL bağlandı...');
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) {
            console.error('Veritabanından filmler alınırken hata:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }
        res.json(results);
    });
});

app.get('/api/movie/:id', (req, res) => {
    const movieId = req.params.id;
    db.query('SELECT * FROM movies WHERE id = ?', [movieId], (err, result) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send('Film bulunamadı');
        }
    });
});

app.get('/api/search', (req, res) => {
    const query = req.query.query;
    const sql = `
        SELECT id, name, image, actor1_name, actor1_photo, actor2_name, actor2_photo, actor3_name, actor3_photo, actor4_name, actor4_photo, actor5_name, actor5_photo
        FROM movies 
        WHERE name LIKE ? OR desc_english LIKE ? OR actor1_name LIKE ? OR actor2_name LIKE ? OR actor3_name LIKE ? OR actor4_name LIKE ? OR actor5_name LIKE ? 
        LIMIT 3
    `;
    const values = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Arama sorgusu sırasında hata:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port}/ adresinde çalışıyor.`);
});
