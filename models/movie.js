const db = require('../db'); // Veritabanı bağlantısını buraya dahil edin

class Movie {
    static getAllMovies(callback) {
        const sql = 'SELECT * FROM movies';
        db.query(sql, callback);
    }

    static getMovieById(id, callback) {
        const sql = 'SELECT * FROM movies WHERE id = ?';
        db.query(sql, [id], callback);
    }

    static searchMovies(query, callback) {
        const sql = `
            SELECT id, name, image, actor1_name, actor1_photo, actor2_name, actor2_photo, actor3_name, actor3_photo, actor4_name, actor4_photo, actor5_name, actor5_photo
            FROM movies 
            WHERE name LIKE ? OR desc_english LIKE ? OR actor1_name LIKE ? OR actor2_name LIKE ? OR actor3_name LIKE ? OR actor4_name LIKE ? OR actor5_name LIKE ? 
            LIMIT 10
        `;
        const values = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
        db.query(sql, values, callback);
    }
}

module.exports = Movie;
