const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static registerUser(userData, callback) {
        const { name, surname, email, password, country, city } = userData;
        const passwordPattern = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (!passwordPattern.test(password)) {
            return callback(null, { success: false, message: 'Password does not meet requirements.' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback(err);
            }

            const sql = 'INSERT INTO users (name, surname, email, password, country, city) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sql, [name, surname, email, hash, country, city], (err, result) => {
                if (err) {
                    console.error('Veritabanı sorgusu sırasında hata:', err);
                    return callback(err);
                }
                callback(null, { success: true });
            });
        });
    }

    static loginUser(email, password, callback) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) {
                console.error('Veritabanı sorgusu sırasında hata:', err);
                return callback(err);
            }

            if (results.length === 0) {
                return callback(null, { success: false, message: 'Invalid email or password.' });
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return callback(err);
                }

                if (isMatch) {
                    callback(null, { success: true, user });
                } else {
                    callback(null, { success: false, message: 'Invalid email or password.' });
                }
            });
        });
    }

    static addToWatchlist(userId, movieId, callback) {
        const sql = 'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)';
        db.query(sql, [userId, movieId], (err, result) => {
            if (err) {
                console.error('Veritabanı sorgusu sırasında hata:', err);
                return callback(err);
            }
            callback(null, { success: true });
        });
    }

    static isInWatchlist(userId, movieId, callback) {
        const sql = 'SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?';
        db.query(sql, [userId, movieId], (err, results) => {
            if (err) {
                console.error('Veritabanı sorgusu sırasında hata:', err);
                return callback(err);
            }
            callback(null, results.length > 0);
        });
    }
}

module.exports = User;
