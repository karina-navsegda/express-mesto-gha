const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, MESTODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

/* app.listen(PORT, () => {
  console.log('порт 3000');
}); */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MESTODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы нет :С'));
});

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
