const express = require('express');
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middlewares/validationData');
const checkMovieExists = require('../middlewares/checkMovieExists')
const router = express.Router();

router.get('/movies/:id/comments', commentController.indexByMovieId);

router.post('/movies/:id/comments', checkMovieExists, validateComment, commentController.createComment)

router.put('/:id', checkMovieExists, commentController.updateComment)

router.delete('/:id', checkMovieExists, commentController.deleteComment)

module.exports = router;