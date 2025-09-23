const movieModel = require("../models/movieModel");
const commentModel = require("../models/commentsModel");

function sendPaginatedResponse(res, recipes, page, limit, total) {
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

      res.status(201).json(movie);
    } catch (error) {
      console.error("Error creating movie:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async listMovies(req, res) {
    const { page = 1, limit = 6, search, genrer } = req.query;
    const offset = (page - 1) * limit;

    if (search) {
      const { movies, total } = await movieModel.findBySearchFilter(
        search,
        Number(limit),
        offset
      );
      return sendPaginatedResponse(res, movies, page, limit, total);
    }

    if (genrer) {
      const { movies, total } = await movieModel.findBySearchFilter(
        genre,
        Number(limit),
        offset
      );
      return sendPaginatedResponse(res, movies, page, limit, total);
    }
  },
};
