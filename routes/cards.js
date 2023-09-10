const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/constants');

const {
  addCard,
  getCards,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegex),
  }),
}), addCard);

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), addLikeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), removeLikeCard);

module.exports = router;
