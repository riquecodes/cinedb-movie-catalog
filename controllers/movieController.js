const movieModel = require("../models/movieModel");

function sendPaginatedResponse(res, movies, page, limit, total) {
  return res.json({
    data: movies,
    pagination: {
      page: Number(page),
      perPage: limit,
      total,
    },
  });
}

const movieController = {
  async createMovie(req, res) {
    try {
      const { title, synopsis, cast, director, genres, year, rating, poster } =
        req.body;

      const newMovie = await movieModel.create({
        title,
        synopsis,
        cast,
        director,
        genres,
        year,
        rating,
        poster,
      });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error creating movie:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async index(req, res) {
    try {
      const { page = 1, search, genrer } = req.query;
      const limit = 6;
      const offset = (page - 1) * limit;

      if (search) {
        const { movies, total } = await movieModel.findBySearchFilter(
          search,
          limit,
          offset
        );
        return sendPaginatedResponse(res, movies, page, limit, total);
      }

      if (genrer) {
        const { movies, total } = await movieModel.findBySearchFilter(
          genrer,
          Number(limit),
          offset
        );
        return sendPaginatedResponse(res, movies, page, limit, total);
      }
    } catch (error) {
      console.error("Error listing movies:", error);
      res.status(500).json({ error: "Erro ao listar filmes." });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieModel.findById(id);

      const comments = await commentModel.findByMovieId(id);

      return res.json({ movie, comments });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ error: "Erro ao buscar detalhes do filme." });
    }
  },

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      await movieModel.deleteMovie(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).json({ error: "Erro ao deletar filme." });
    }
  },

  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const { title, synopsis, cast, director, genres, year, rating, poster } =
        req.body;

      const updateMovie = await movieModel.updateMovie(id, {
        title,
        synopsis,
        cast,
        director,
        genres,
        year,
        rating,
        poster,
      });

      return res.json(updateMovie);
    } catch (error) {
      console.error("Error updating movie:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = movieController;