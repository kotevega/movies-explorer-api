/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { ErrorUnauthorized } = require('../utils/error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
