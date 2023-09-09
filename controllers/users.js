const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;

const { default: mongoose } = require('mongoose');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-err');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
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

/* module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Неверный формат идентификатора пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
}; */

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

/* module.exports.editUser = (req, res, next) => {
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
        }
      });
  } else {
    next(err);
  }
}; */

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { runValidators: true, new: 'true' },
    )
      .orFail()
      .then((user) => { res.status(HTTP_STATUS_OK).send(user); })
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
      { runValidators: true, new: 'true' },
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
