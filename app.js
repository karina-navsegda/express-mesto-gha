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

app.listen(PORT);
