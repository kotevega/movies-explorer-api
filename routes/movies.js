const movieRouter = require('express').Router();
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');
const { validatePostMovie, validateDeleteMovie } = require('../utils/validate');

movieRouter.get('/', getMovies);
movieRouter.post('/', validatePostMovie, postMovie);
movieRouter.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
