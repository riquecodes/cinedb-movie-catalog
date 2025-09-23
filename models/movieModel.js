const pool = require("../db");
const Movie = require("../domain/movie");

const movieModel = {
  async create({
    title,
    synopsis,
    cast,
    director,
    genrers,
    year,
    rating,
    poster,
  }) {
    const [result] = await pool.query(
      `INSERT INTO movies (title, synopsis, cast, director, genrers, year, rating, poster)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        synopsis,
        JSON.stringify(cast),
        director,
        JSON.stringify(genrers),
        year,
        rating,
        poster,
      ]
    );

    return new Movie({
      id: result.insertId,
      title,
      synopsis,
      cast,
      director,
      genrers,
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
          genrers: JSON.parse(m.genrers),
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
    return new Movie({
      id: m.id,
      title: m.title,
      synopsis: m.synopsis,
      cast: JSON.parse(m.cast),
      director: m.director,
      genrers: JSON.parse(m.genrers),
      year: m.year,
      rating: m.rating,
      poster: m.poster,
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

    const movies = rows.map(
      (m) =>
        new Movie({
          id: m.id,
          title: m.title,
          synopsis: m.synopsis,
          cast: JSON.parse(m.cast),
          director: m.director,
          genrers: JSON.parse(m.genrers),
          year: m.year,
          rating: m.rating,
          poster: m.poster,
          createdAt: m.createdAt,
        })
    );

    return { movies, total };
  },

  async findBySearchFilter(term = null, genrer = null, limit = 6, offset = 0) {
    const searchTerm = `%${term}%`;

    let query = `SELECT * FROM movies WHERE 1=1`;
    const params = [];

    let countQuery = `SELECT COUNT(*) AS total FROM movies WHERE 1=1`;
    const countParams = [];

    if (term) {
      query += ` AND title LIKE LOWER(?)`;
      params.push(searchTerm);

      countQuery += ` AND title LIKE LOWER(?)`;
      countParams.push(searchTerm);
    }

    if (genrer) {
      query += ` AND JSON_CONTAINS(genrers, ?)`;
      params.push(JSON.stringify(genrer));

      countQuery += ` AND JSON_CONTAINS(genrers, ?)`;
      countParams.push(JSON.stringify(genrer));
    }

    query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    const [[{ total }]] = await pool.query(countQuery, countParams);

    const movies = rows.map(
      (m) =>
        new Movie({
          id: m.id,
          title: m.title,
          synopsis: m.synopsis,
          cast: JSON.parse(m.cast),
          director: m.director,
          genrers: JSON.parse(m.genrers),
          year: m.year,
          rating: m.rating,
          poster: m.poster,
          createdAt: m.createdAt,
        })
    );

    return { movies, total };
  },
};

module.exports = movieModel;