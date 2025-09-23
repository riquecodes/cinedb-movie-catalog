const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const movieModel = require('../models/movieModel');
const commentModel = require('../models/commentsModel');
const userModel = require('../models/userModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.username === 'admin') {
        return next();
    }
    res.redirect('/');
};

router.get('/', (req, res) => {
    if (req.session.user) { return res.redirect('/catalog'); }
    res.render('login', { error: null });
});

router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.render('register', { error: 'Usuário e senha são obrigatórios.' });
        }
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) {
            return res.render('register', { error: 'Este nome de usuário já existe.' });
        }
        await userModel.register({ username, password });
        res.redirect('/');
    } catch (error) {
        console.error("erro no register:", error);
        res.render('register', { error: 'Ocorreu um erro ao registrar.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        try {
            let adminUser = await userModel.findByUsername('admin');
            if (!adminUser) {
                adminUser = await userModel.register({ username: 'admin', password: '123456' });
            }
            req.session.user = { id: adminUser.id, username: adminUser.username };
            return res.redirect('/admin');
        } catch (error) {
            console.error("erro no login:", error);
            return res.render('login', { error: 'Ocorreu um erro ao processar o login do admin.' });
        }
    }
    try {
        const user = await userModel.findByUsername(username);
        if (user && user.password === password) {
            req.session.user = { id: user.id, username: user.username };
            return res.redirect('/catalog');
        }
        res.render('login', { error: 'Usuário ou senha inválidos.' });
    } catch (error) {
        res.render('login', { error: 'Ocorreu um erro ao fazer login.' });
    }
});

router.get('/catalog', isAuthenticated, async (req, res) => {
    try {
        const { search, genre } = req.query;
        const { movies } = await movieModel.findBySearchFilter(search, genre, 20, 0);
        const allMoviesResponse = await movieModel.findMovies(1000, 0);
        const allGenres = allMoviesResponse.movies.flatMap(movie => movie.genres);
        const uniqueGenres = [...new Set(allGenres)].sort();
        res.render('index', { movies, genres: uniqueGenres, currentGenre: genre });
    } catch (error) {
        res.status(500).send("Erro ao carregar filmes.");
    }
});

router.get('/movie/:id', isAuthenticated, async (req, res) => { 
    try {
        const movie = await movieModel.findById(req.params.id);
        const comments = await commentModel.findByMovieId(req.params.id); 
        if (!movie) return res.status(404).send("Filme não encontrado.");
        res.render('movie-details', { movie, comments });
    } catch (error) {
        console.error("Erro ao carregar detalhes do filme:", error);
        res.status(500).send("Erro ao carregar detalhes do filme.");
    }
});


router.post('/movie/:movieId/comment', isAuthenticated, async (req, res) => { 
    try {
        const { movieId } = req.params;
        const { comment, commentRating } = req.body;
        const userId = req.session.user.id;

        await commentModel.create({ movieId, userId, comment, commentRating });
        res.redirect(`/movie/${movieId}`);

        await movieModel.updateAverageRating(movieId);
        
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        res.status(500).send("Erro ao adicionar comentário.");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


router.get('/admin', isAdmin, async (req, res) => {
    const { movies } = await movieModel.findMovies(50, 0);
    res.render('admin/dashboard', { movies });
});

router.get('/admin/add', isAdmin, (req, res) => { res.render('admin/add-movie'); });

router.post('/admin/add', isAdmin, upload.single('poster'), async (req, res) => {
    const { title, synopsis, cast, director, genres, year, rating } = req.body;
    const posterPath = req.file ? `/uploads/${req.file.filename}` : null;
    await movieModel.create({
        title, synopsis, cast: cast.split(',').map(item => item.trim()),
        director, genres: genres.split(',').map(item => item.trim()),
        year, rating, poster: posterPath
    });
    res.redirect('/admin');
});

router.get('/admin/edit/:id', isAdmin, async (req, res) => {
    const movie = await movieModel.findById(req.params.id);
    res.render('admin/edit-movie', { movie });
});

router.post('/admin/edit/:id', isAdmin, upload.single('poster'), async (req, res) => {
    const { title, synopsis, cast, director, genres, year, rating } = req.body;
    const currentMovie = await movieModel.findById(req.params.id);
    const posterPath = req.file ? `/uploads/${req.file.filename}` : currentMovie.poster;
    await movieModel.updateMovie(req.params.id, {
        title, synopsis, cast: cast.split(',').map(item => item.trim()),
        director, genres: genres.split(',').map(item => item.trim()),
        year, rating, poster: posterPath
    });
    res.redirect('/admin');
});

router.post('/admin/delete/:id', isAdmin, async (req, res) => {
    await movieModel.deleteMovie(req.params.id);
    res.redirect('/admin');
});

module.exports = router;