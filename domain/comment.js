class Comment {
  constructor({ id, movieId, userId, comment, rating, createdAt }) {
    this.id = id;
    this.movieId = movieId;
    this.userId = userId;
    this.comment = comment;
    this.rating = rating;
    this.createdAt = createdAt;
  }
}

module.exports = Comment;