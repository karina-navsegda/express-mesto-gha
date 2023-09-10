// models/card.js
const mongoose = require('mongoose');
const { linkRegex } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная длина имени — 30 символов'],
  },
  link: {
    type: String, // — это строка
    required: [true, 'Обязательное поле'],
    validate: {
      validator(v) {
        return linkRegex.test(v);
      },
      message: 'Вставьте ссылку на изображение',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Обязательное поле'],
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('Card', cardSchema);
