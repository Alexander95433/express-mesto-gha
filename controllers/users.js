const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadAuthError = require('../errors/BadAuthError');
const BadRequestError = require('../errors/BadRequestError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const EmailErrorAlreadyExists = require('../errors/EmailErrorAlreadyExists');

const User = require('../models/user');

const login = ((req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ token });
    })
    .catch(() => { next(new BadAuthError('Неправильные почта или пароль')); });
});

const createUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return next(new BadRequestError('Переданы невалидные данные')); }
      if (err.code === 11000) { return next(new EmailErrorAlreadyExists(err.message)); }
      return next(err);
    });
};

const getUser = ((req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw new ErrorNotFound('Пользователь не найден'); }
      return res.send(user);
    })
    .catch(next);
});

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  User.findById(req.params.id).orFail(() => { next(new ErrorNotFound('пользователь с таким id не найден')); })
    .then((user) => { if (user) { res.send(user); } })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) { return next(new BadRequestError('Не корректный id')); }
      return next(err);
    });
};

const updateUserProfile = ((req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(new Error('NotFound'))
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return next(new BadRequestError('Переданы невалидные данные')); }
      if (err.message === 'NotFound') { return next(new ErrorNotFound('Пользователь с указанным _id не найден')); }
      return next(err);
    });
});

const patchUserAvatar = ((req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(new Error('NotFound'))
    .then((avatsrUpdated) => { res.send(avatsrUpdated); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return next(new BadRequestError('Переданы невалидные данные')); }
      if (err.message === 'NotFound') { return next(new ErrorNotFound('Пользователь с указанным _id не найден')); }
      return next(err);
    });
});

module.exports = {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar, login, getUser,
};
