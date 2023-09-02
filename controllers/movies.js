const Movie = require('../models/movie');
const {
  ErrorValidation,
  ErrorForbidden,
  ErrorNotFound,
} = require('../utils/error');

const getMovies = (req, res, next) => {
  const id = req.user._id;
  Movie.find({ owner: id })
    .then((movie) => res.send(movie))
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const id = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorValidation('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new ErrorNotFound('Данные не найдены'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then((movies) => res.send(movies))
          .catch(next);
      } else {
        next(new ErrorForbidden('Нет доступа'));
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
