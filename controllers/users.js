const mongoose = require('mongoose');
const User = require('../models/user');
const {
  INCORRECT_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE, SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.status(SUCCESS_CREATED_CODE).send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch(() => { res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }); });
};

const getUsersById = (req, res) => {
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status.send({ message: 'Не корректный id' });
      }
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с таким _id не найден' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUserProfile = ((req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(new Error('NotFound'))
    .then(() => { res.send({ messege: 'Обновления прошло успешно' }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' }); }
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
});

const patchUserAvatar = ((req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }).orFail(new Error('NotFound'))
    .then((avatsrUpdated) => { res.send({ message: 'Обновление прошло успешно', avatsrUpdated }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' }); }
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
});

module.exports = {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar,
};
