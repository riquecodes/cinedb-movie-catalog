class Comment {
  constructor({ id, movieId, userId, username = null, comment, commentRating, createdAt }) {
    this.id = id;
    this.movieId = movieId;
    this.userId = userId;
    this.username = username;
    this.comment = comment;
    this.commentRating = commentRating;
    this.createdAt = createdAt;
  }
}

module.exports = Comment;