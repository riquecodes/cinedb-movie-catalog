const pool = require("../db");
const Comment = require("../domain/comment");

const commentModel = {
  async create({ movieId, userId, comment, commentRating }) {
    const [result] = await pool.query(
      `INSERT INTO comments (movie_id, user_id, comment, rating)
       VALUES (?, ?, ?, ?)`,
      [movieId, userId, comment, commentRating]
    );

    return new Comment({
      id: result.insertId,
      movieId,
      userId,
      comment,
      commentRating,
    });
  },

  async deleteComment(id) {
    const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  async updateComment(id, { comment, commentRating }) {
    const [result] = await pool.query(
      "UPDATE comments SET comment = ?, rating = ? WHERE id = ?",
      [comment, commentRating, id]
    );
    return result.affectedRows > 0;
  },

  async findByMovieId(movieId) {
    const [rows] = await pool.query(
      `SELECT
          c.id,
          c.movie_id,
          c.user_id,
          c.comment,
          c.rating,
          c.created_at,
          u.username
       FROM comments AS c
       LEFT JOIN users AS u ON c.user_id = u.id
       WHERE c.movie_id = ?
       ORDER BY c.created_at DESC`,
      [movieId]
    );

    return rows.map(
      (c) =>
        new Comment({
          id: c.id,
          movieId: c.movie_id,
          userId: c.user_id,
          username: c.username,
          comment: c.comment,
          commentRating: c.rating,
          createdAt: c.created_at,
        })
    );
  },
};

module.exports = commentModel;