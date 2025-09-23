const commentModel = require("../models/commentsModel");

const commentController = {
  async createComment(req, res) {
    try {
      const { movieId } = req.params;
      const { comment, commentRating } = req.body;

      const newComment = await commentModel.create({
        movieId,
        comment,
        commentRating,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error adding comment: ", error);
      res.status(500).json({ error: "Erro ao adicionar comentário." });
    }
  },

  async indexByMovieId(req, res) {
    try {
      const { movieId } = req.params;

      const comments = await commentModel.findByMovieId(movieId);
      return res.status(200).json(comments);
    } catch (error) {
      console.error("Error searching comments: ", error);
      res
        .status(500)
        .json({ error: "Não foi possível carregar os comentários." });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      await commentModel.deleteComment(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment: ", error);
      res.status(500).json({ error: "Erro ao excluir comentário." });
    }
  },

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { comment, commentRating } = req.body;

      const updateComment = await commentModel.updateComment(id, {
        comment,
        commentRating,
      });

      return res.json(updateComment);
    } catch (error) {
      console.error("Error updating comment: ", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = commentController;
