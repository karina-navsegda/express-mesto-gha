const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;

const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-err');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }).then((user) => res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    })))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данный Email уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(
          new BadRequestError(
            `Неверный формат идентификатора пользователя: ${req.params.userId}`,
          ),
        );
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { runValidators: true, new: 'true' },
    )
      .orFail()
      .then((user) => {
        res.status(HTTP_STATUS_OK).send(user);
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(
            new BadRequestError(
              `Неверный формат идентификатора пользователя: ${req.params.userId}`,
            ),
          );
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError('Пользователь не найден'));
        } else {
          next(err);
        }
      });
  } else {
    const err = new Error('Пользователь не найден');
    next(err);
  }
};

module.exports.editAvatar = (req, res, next) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { runValidators: true, new: true },
    )
      .then((user) => {
        res.status(HTTP_STATUS_OK).send(user);
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(
            new BadRequestError(
              `Неверный формат идентификатора пользователя: ${req.params.userId}`,
            ),
          );
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError('Пользователь не найден'));
        }
      });
  } else {
    const err = new Error('Пользователь не найден');
    next(err);
  }
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
