const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('bad-request-error');
const User = require('../models/user');

const login = ((req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
  //отпавка куки
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send(token);
    })
    .catch((err) => { next(res.status(401).send({ message: err.message })); });
});

const createUsers = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(BadRequestError).send({ message: 'Поля email и password обязательны' });
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => { res.status(201).send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы невалидные данные' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch(() => { res.status(500).send({ message: 'Ошибка по умолчанию.' }); });
};

const getUsersById = (req, res) => {
  User.findById(req.params.id).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный id' });
      }
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с таким _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUserProfile = ((req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(new Error('NotFound'))
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return res.status(400).send({ message: 'Переданы невалидные данные' }); }
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
});

const patchUserAvatar = ((req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(new Error('NotFound'))
    .then((avatsrUpdated) => { res.send(avatsrUpdated); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return res.status(400).send({ message: 'Переданы невалидные данные' }); }
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
});

module.exports = {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar, login,
};
