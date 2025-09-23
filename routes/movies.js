const express = require('express');
const movieController = require('../controllers/movieController');
const { validateMovie } = require('../middlewares/validationData');
const checkMovieExists = require('../middlewares/checkMovieExists')
const router = express.Router();

router.get('/', movieController.index);

router.post('/', validateMovie, movieController.createMovie)

router.get('/:id', checkMovieExists, movieController.show)

router.delete('/:id', checkMovieExists, movieController.deleteMovie)

router.put('/:id', checkMovieExists, movieController.updateMovie)

module.exports = router;