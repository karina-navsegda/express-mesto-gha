// routes/users.js
// файл маршрутов

const router = require('express').Router();

const {
  createUser,
  getUser,
  getUserId,
  editUser,
  editAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUser);
router.get('/:userId', getUserId);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;
