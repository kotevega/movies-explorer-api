const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  ErrorValidation,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorConflict,
} = require('../utils/error');

const getAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new ErrorNotFound('Данных с указанным id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Запрашиваемые данные не найдены'));
      } else {
        next(err);
      }
    });
};

const patchUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict('Данный email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).json({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ErrorConflict('Данный email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Запрашиваемые данные не найдены'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new ErrorUnauthorized('Неправильные почта или пароль'))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              {
                expiresIn: '7d',
              },
            );
            res.cookie('jwt', token, {
              maxAge: 604800,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });
            res.send({ message: 'Регистрация успешна' });
          } else {
            next(new ErrorUnauthorized('Неправильные почта или пароль'));
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getAboutUser,
  patchUserProfile,
  createUser,
  login,
};
