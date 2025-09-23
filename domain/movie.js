class Movie {
  constructor({
    id,
    title,
    synopsis,
    cast = [],
    director,
    genres = [],
    year,
    rating,
    poster,
    createdAt,
  }) {
    this.id = id;
    this.title = title;
    this.synopsis = synopsis;
    this.cast = cast;
    this.director = director;
    this.genres = genres;
    this.year = year;
    this.rating = rating;
    this.poster = poster;
    this.createdAt = createdAt;
  }
}

module.exports = Movie;