const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../utils/validate');
const { login, createUser } = require('../controllers/users');
const { ErrorNotFound } = require('../utils/error');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signout', auth, (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.send({ message: 'Выход' });
});

router.use('*', auth, (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
