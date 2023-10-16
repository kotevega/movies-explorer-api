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

mongoose.connect(process.env.NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(errorLogger);
app.use(requestLogger);
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
app.use(errors());
app.use(error);
app.listen(process.env.NODE_ENV === 'production' ? PORT : '3000', () => {
  console.log(`Слушаем ${PORT} порт`);
});
