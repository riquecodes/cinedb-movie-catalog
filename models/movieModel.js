const pool = require("../db");
const Movie = require("../domain/movie");

const movieModel = {
  async updateAverageRating(movieId) {
    const [rows] = await pool.query(
      "SELECT rating FROM comments WHERE movie_id = ?",
      [movieId]
    );

    if (rows.length === 0) {
      return;
    }

    const sum = rows.reduce((total, row) => total + row.rating, 0);
    const average = sum / rows.length;

    await pool.query("UPDATE movies SET rating = ? WHERE id = ?", [
      average,
      movieId,
    ]);
  },

  async create({
    title,
    synopsis,
    cast,
    director,
    genres,
    year,
    rating,
    poster,
  }) {
    const safeCast = Array.isArray(cast) ? cast : cast ? [cast] : [];
    const safeGenres = Array.isArray(genres) ? genres : genres ? [genres] : [];

    const [result] = await pool.query(
      `INSERT INTO movies (title, synopsis, cast, director, genres, year, rating, poster)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        synopsis,
        JSON.stringify(safeCast),
        director,
        JSON.stringify(safeGenres),
        year,
        rating,
        poster,
      ]
    );

    return new Movie({
      id: result.insertId,
      title,
      synopsis,
      cast: safeCast,
      director,
      genres: safeGenres,
      year,
      rating,
      poster,
    });
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT * FROM movies ORDER BY createdAt DESC"
    );
    return rows.map(
      (m) =>
        new Movie({
          id: m.id,
          title: m.title,
          synopsis: m.synopsis,
          cast: JSON.parse(m.cast),
          director: m.director,
          genres: JSON.parse(m.genres),
          year: m.year,
          rating: m.rating,
          poster: m.poster,
          createdAt: m.createdAt,
        })
    );
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    const m = rows[0];

    let cast = [];
    let genres = [];

    try {
      cast = Array.isArray(m.cast) ? m.cast : JSON.parse(m.cast || "[]");
    } catch {
      cast = [];
    }

    try {
      genres = Array.isArray(m.genres)
        ? m.genres
        : JSON.parse(m.genres || "[]");
    } catch {
      genres = [];
    }

    return new Movie({
      id: m.id,
      title: m.title,
      synopsis: m.synopsis,
      cast,
      director: m.director,
      genres,
      year: m.year,
      rating: m.rating,
      poster: m.poster || "/images/default-poster.jpg",
      createdAt: m.createdAt,
    });
  },

  async findMovies(limit = 6, offset = 0) {
    const [rows] = await pool.query(
      "SELECT * FROM movies ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM movies`
    );

    const movies = rows.map((m) => {
      const cast = Array.isArray(m.cast) ? m.cast : [];
      const genres = Array.isArray(m.genres) ? m.genres : [];

      return new Movie({
        id: m.id,
        title: m.title,
        synopsis: m.synopsis,
        cast,
        director: m.director,
        genres,
        year: m.year,
        rating: m.rating,
        poster: m.poster,
        createdAt: m.createdAt,
      });
    });
    return { movies, total };
  },

  async findBySearchFilter(term = null, genre = null, limit = 6, offset = 0) {
    const searchTerm = term ? `%${term}%` : null;

    let query = `SELECT * FROM movies WHERE 1=1`;
    const params = [];

    let countQuery = `SELECT COUNT(*) AS total FROM movies WHERE 1=1`;
    const countParams = [];

    if (searchTerm) {
      query += ` AND title LIKE ?`;
      params.push(searchTerm);

      countQuery += ` AND title LIKE ?`;
      countParams.push(searchTerm);
    }

    if (genre) {
      query += ` AND JSON_CONTAINS(genres, ?)`;
      params.push(JSON.stringify(genre));

      countQuery += ` AND JSON_CONTAINS(genres, ?)`;
      countParams.push(JSON.stringify(genre));
    }

    query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    const [[{ total }]] = await pool.query(countQuery, countParams);

    const movies = rows.map((m) => {
      let cast = [];
      let genres = [];

      try {
        cast = Array.isArray(m.cast) ? m.cast : JSON.parse(m.cast || "[]");
      } catch {
        cast = [];
      }

      try {
        genres = Array.isArray(m.genres)
          ? m.genres
          : JSON.parse(m.genres || "[]");
      } catch {
        genres = [];
      }

      return new Movie({
        id: m.id,
        title: m.title,
        synopsis: m.synopsis,
        cast,
        director: m.director,
        genres,
        year: m.year,
        rating: m.rating,
        poster: m.poster,
        createdAt: m.createdAt,
      });
    });

    return { movies, total };
  },

  async deleteMovie(id) {
    const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  async updateMovie(
    id,
    { title, synopsis, cast, director, genres, year, rating, poster }
  ) {
    const [result] = await pool.query(
      "UPDATE movies SET title = ?, synopsis = ?, cast = ?, director = ?, genres = ?, year = ?, rating = ?, poster = ? WHERE id = ?",
      [
        title,
        synopsis,
        JSON.stringify(cast),
        director,
        JSON.stringify(genres),
        year,
        rating,
        poster,
        id,
      ]
    );
    return result.affectedRows > 0;
  },
};

module.exports = movieModel;
