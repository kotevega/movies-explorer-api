require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const error = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');

const { PORT, DB_URL } = process.env;

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://koloproject.nomoredomainsicu.ru'],
    credentials: true,
  }),
);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);
app.use(requestLogger);

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
