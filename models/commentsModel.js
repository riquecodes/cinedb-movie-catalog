const pool = require("../db");
const Comment = require("../domain/comment");

const commentModel = {
  async create({ movieId, userId, comment, rating }) {
    const [result] = await pool.query(
      `INSERT INTO comments (movieId, userId, comment, rating)
        VALUES (?, ?, ?, ?)`,
      [movieId, userId, comment, rating]
    );

    return new Comment({
      id: result.insertId,
      movieId, 
      userId, 
      comment, 
      rating
    });
  },

  async findByMovieId(movieId) {
    const [rows] = await pool.query(
      "SELECT * FROM comments WHERE movieId = ? ORDER BY createdAt DESC",
      [movieId]
    );
    return rows.map(
      (c) =>
        new Comment({
          id: c.id,
          movieId: c.movieId,
          userId: c.userId, 
          comment: c.comment, 
          rating: c.rating,
          createdAt: c.createdAt,
        })
    );
  },
};

module.exports = commentModel;