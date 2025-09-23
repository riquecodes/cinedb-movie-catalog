const pool = require("../db");
const Movie = require("../domain/movie");

const movieModel = {
  async create({ title, synopsis, cast, director, genres, year, rating }) {
    const [result] = await pool.query(
      `INSERT INTO movies (title, synopsis, cast, director, genres, year, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [title, synopsis, cast, director, JSON.stringify(genres), year, rating]
    );

    return new Recipe({
      id: result.insertId,
      title,
      synopsis,
      cast,
      director,
      genres,
      year,
      rating,
    });
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT * FROM movies ORDER BY createdAt DESC"
    );
    return rows.map(
      (r) =>
        new Movie({
          id: r.id,
          title: r.title,
          synopsis: r.synopsis,
          cast: r.cast,
          director: r.director,
          genres: JSON.parse(r.genres),
          year: r.year,
          rating: r.rating,
          createdAt: r.createdAt,
        })
    );
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return new Movie({
      id: r.id,
      title: r.title,
      synopsis: r.synopsis,
      cast: r.cast,
      director: r.director,
      genres: JSON.parse(r.genres),
      year: r.year,
      rating: r.rating,
      createdAt: r.createdAt,
    });
  },

  async findMoviesWithPagination(limit = 6, offset = 0) {
    const [rows] = await pool.query(
      "SELECT * FROM movies ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM movies`
    );

    const movies = rows.map(
      (r) =>
        new Movie({
          id: r.id,
          title: r.title,
          synopsis: r.synopsis,
          cast: r.cast,
          director: r.director,
          genres: JSON.parse(r.genres),
          year: r.year,
          rating: r.rating,
          createdAt: r.createdAt,
        })
    );

    return { movies, total };
  },

  async findByGenreWithPagination(genre, limit = 6, offset = 0) {
    const [rows] = await pool.query(
      `SELECT * FROM movies
     WHERE JSON_CONTAINS(genres, ?)
     ORDER BY createdAt DESC
     LIMIT ? OFFSET ?`,
      [JSON.stringify(genre), limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
     FROM movies
     WHERE JSON_CONTAINS(genres, ?)`,
      [JSON.stringify(genre)]
    );

    const movies = rows.map(
      (r) =>
        new Movie({
          id: r.id,
          title: r.title,
          synopsis: r.synopsis,
          cast: r.cast,
          director: r.director,
          genres: JSON.parse(r.genres),
          year: r.year,
          rating: r.rating,
          createdAt: r.createdAt,
        })
    );

    return { movies, total };
  },
  async searchWithPagination(term, limit = 6, offset = 0) {
    const searchTerm = `%${term}%`;

    let query = `SELECT * FROM movies WHERE title LIKE ?`;

    let params = [searchTerm];

    if (genre) {
      query += ` AND JSON_CONTAINS(genres, ?)`;
      params.push(JSON.stringify(genre));
    }

    query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    let countQuery = `SELECT COUNT(*) AS total FROM movies WHERE title LIKE ?`;
    let countParams = [searchTerm];

    if (genre) {
      countQuery += ` AND JSON_CONTAINS(genres, ?)`;
      countParams.push(JSON.stringify(genre));
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    const movies = rows.map(
      (r) =>
        new Movie({
          id: r.id,
          title: r.title,
          synopsis: r.synopsis,
          cast: r.cast,
          director: r.director,
          genres: JSON.parse(r.genres),
          year: r.year,
          rating: r.rating,
          createdAt: r.createdAt,
        })
    );

    return { movies, total };
  },
};

module.exports = movieModel;
