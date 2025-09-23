const movieModel = require("../models/movieModel");

async function checkMovieExists(req, res, next) {
  const movie = await movieModel.findById(req.params.id);
  if (!movie) {
    return res.status(404).send({ error: "Filme não encontrado." });
  }
  req.movie = movie;
  next();
}

module.exports = checkMovieExists;