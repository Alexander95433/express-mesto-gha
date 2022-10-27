const mongoose = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(201).send({ card, message: 'Карточка успешно создана' }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы не валидные данные', err });
      }
      return res.status(500).send({ message: 'Не удалось создать карточку' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => { res.status(201).send({ cards, message: 'Карточки успешно получены' }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы не валидные данные', err });
      }
      return res.status(500).send({ message: 'Не удалось получить карточки', err });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))
    .then((card) => {
      res.status(201).send({ card, message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Карточка с таким _id не найдена' }); }
      return res.status(500).send({ message: 'На сервере произошла ошибка при получение _id пользователя', err });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((like) => { res.status(201).send({ like, message: 'Like успешно добавлен' }); })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Переданы не валидные данные', err }); }
      return res.status(500).send({ message: 'На сервере произошла ошибка. Не удалось применить изменение', err });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => { res.status(201).send({ like, message: 'Like успешно удалёт' }); })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Переданы не валидные данные', err }); }
      return res.status(500).send({ message: 'На сервере произошла ошибка. Не удалось применить изменение', err });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
