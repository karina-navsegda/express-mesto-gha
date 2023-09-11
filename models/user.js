// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-error');
const { linkRegex, emailRegex } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // имя — это строка
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина имени — 2 символа'],
      maxlength: [30, 'Максимальная длина имени — 30 символов'],
    },
    about: {
      type: String, // — это строка
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина описания — 2 символа'],
      maxlength: [30, 'Максимальная длина описания — 30 символов'],
    },
    avatar: {
      type: String, // — это строка
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return linkRegex.test(v);
        },
        message: 'Вставьте ссылку на изображение',
      },
    },
    password: {
      type: String,
      required: [true, 'Необходимо заполнить поле'],
      select: false,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Необходимо заполнить поле'],
      validate: {
        validator(email) {
          return emailRegex.test(email);
        },
        message: 'Введите корректный E-mail адрес',
      },
    },
  },

  { versionKey: false },
);
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(
          'Введены неправильные почта пользователя или пароль',
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(
            'Введены неправильные почта пользователя или пароль',
          );
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('User', userSchema);
