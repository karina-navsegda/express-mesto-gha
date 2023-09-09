const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

const { PORT = 3000, MESTODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

/* app.listen(PORT, () => {
  console.log('порт 3000');
}); */


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(MESTODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64e49360c4f7fd465182be46', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы нет :С' });
});

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
