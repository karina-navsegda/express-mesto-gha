const router = require("express").Router();

const {
  addCard,
  getCards,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require("../controllers/cards");

router.post("/", addCard);
router.get("/", getCards);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", addLikeCard);
router.delete("/:cardId/likes", removeLikeCard);

module.exports = router;
