const db = require('../db');

class Rating {
    static addRating(userId, movieId, rating, callback) {
        const sql = 'INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?';
        db.query(sql, [userId, movieId, rating, rating], callback);
    }

    static getRating(userId, movieId, callback) {
        const sql = 'SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?';
        db.query(sql, [userId, movieId], callback);
    }

    static getAverageRating(movieId, callback) {
        const sql = 'SELECT AVG(rating) as averageRating FROM ratings WHERE movie_id = ?';
        db.query(sql, [movieId], callback);
    }
}

module.exports = Rating;
