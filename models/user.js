// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная длина имени — 30 символов'],
  },
  about: {
    type: String, // — это строка
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина описания — 2 символа'],
    maxlength: [30, 'Максимальная длина описания — 30 символов'],
  },
  avatar: {
    type: String, // — это строка
    required: [true, 'Обязательное поле'],
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
      message: 'Вставьте ссылку на изображение',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);
