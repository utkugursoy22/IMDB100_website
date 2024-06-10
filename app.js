const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Movie = require('./models/movie');
const User = require('./models/user');
const Rating = require('./models/rating');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/api/register', (req, res) => {
    const userData = req.body;
    User.registerUser(userData, (err, result) => {
        if (err) {
            console.error('Kullanıcı kaydı sırasında hata:', err);
            return res.json({ success: false, message: 'Database error.' });
        }
        res.json(result);
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    User.loginUser(email, password, (err, result) => {
        if (err) {
            console.error('Kullanıcı girişi sırasında hata:', err);
            return res.json({ success: false, message: 'Database error.' });
        }
        if (result.success) {
            req.session.user = result.user;
        }
        res.json(result);
    });
});

app.get('/api/checkLogin', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, name: req.session.user.name });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/addToWatchlist', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'Not logged in.' });
    }

    const userId = req.session.user.id;
    const { movieId } = req.body;

    User.addToWatchlist(userId, movieId, (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Database error.' });
        }
        res.json({ success: true });
    });
});

app.get('/api/checkWatchlist', (req, res) => {
    if (!req.session.user) {
        return res.json({ inWatchlist: false });
    }

    const userId = req.session.user.id;
    const movieId = req.query.movieId;

    User.isInWatchlist(userId, movieId, (err, result) => {
        if (err) {
            return res.json({ inWatchlist: false });
        }
        res.json({ inWatchlist: result });
    });
});


app.post('/api/rate', (req, res) => {
    const { movieId, rating } = req.body;
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }
    const userId = req.session.user.id;
    Rating.addRating(userId, movieId, rating, (err) => {
        if (err) {
            console.error('Error adding rating:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true });
    });
});


app.get('/api/rating', (req, res) => {
    const { movieId } = req.query;
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }
    const userId = req.session.user.id;
    Rating.getRating(userId, movieId, (err, result) => {
        if (err) {
            console.error('Error fetching rating:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(result[0]);
    });
});

app.get('/api/averageRating', (req, res) => {
    const { movieId } = req.query;
    Rating.getAverageRating(movieId, (err, result) => {
        if (err) {
            console.error('Error fetching average rating:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(result[0]);
    });
});

app.get('/api/movies', (req, res) => {
    Movie.getAllMovies((err, results) => {
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
    Movie.getMovieById(movieId, (err, result) => {
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
    Movie.searchMovies(query, (err, results) => {
        if (err) {
            console.error('Arama sorgusu sırasında hata:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }
        
        const filteredResults = results.map(result => {
            return {
                ...result,
                actors: [
                    { name: result.actor1_name, photo: result.actor1_photo },
                    { name: result.actor2_name, photo: result.actor2_photo },
                    { name: result.actor3_name, photo: result.actor3_photo },
                    { name: result.actor4_name, photo: result.actor4_photo },
                    { name: result.actor5_name, photo: result.actor5_photo }
                ].filter(actor => actor.name && actor.name.toLowerCase().includes(query.toLowerCase()))
            };
        });
        res.json(filteredResults);
    });
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port}/ adresinde çalışıyor.`);
});
