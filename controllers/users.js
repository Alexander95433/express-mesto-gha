const mongoose = require('mongoose');
const User = require('../models/user');

const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.status(201).send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя', err });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'На сервере произошла ошибка при получение информации о пользователе', err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status.send({ message: 'Не корректный id', err });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
};

const getUsersById = (req, res) => {
  User.findById(req.params._id).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с таким _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
};

const updateUserProfile = ((req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }).orFail(new Error('NotFound'))
    .then(() => { res.status(201).send({ messege: 'Обновления прошло успешно' }); })
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
});

const patchUserAvatar = ((req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }).orFail(new Error('NotFound'))
    .then((avatsrUpdated) => { res.status(201).send({ message: 'Обновление прошло успешно', avatsrUpdated }); })
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию.', err });
    });
});

module.exports = {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar,
};
