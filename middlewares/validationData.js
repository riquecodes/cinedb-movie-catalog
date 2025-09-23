function validateMovie(req, res, next) {
  let { title, synopsis, cast, director, genres, year } =
    req.body;
  if (!title || title.trim() === "") {
    return res.status(400).send({ error: "O título do filme é obrigatório." });
  }

  if (!director || director.trim() === "") {
    return res.status(400).send({ error: "O diretor é obrigatório." });
  }

  if (!Array.isArray(genres) || genres.length === 0) {
    return res
      .status(400)
      .send({ error: "Informe pelo menos 1 genero que o filme se encaixa." });
  }

  if (!synopsis || synopsis.trim().length < 40) {
    return res
      .status(400)
      .send({ error: "A sinopse deve ter pelo menos 40 caracteres." });
  }

  if (!Array.isArray(cast) || cast.length === 0) {
    return res
      .status(400)
      .send({ error: "Informe pelo menos 1 ator que participa do filme." });
  }

  if (!year || isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
    return res
      .status(400)
      .send({ error: "Informe um ano válido para o filme." });
  }

  next();
}

function validateComment(req, res, next) {
  const { comment, rating } = req.body;
  if (!comment || comment.trim().length < 10) {
    return res
      .status(400)
      .send({
        error: "O conteúdo do comentário deve ter pelo menos 10 caracteres.",
      });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).send({
      error: "A avaliação deve ser um número entre 1 e 5.",
    });
  }
  next();
}

module.exports = { validateRecipe, validateComment };
