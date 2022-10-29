const mongoose = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(201).send({ card, message: 'Карточка успешно создана' }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => { res.send({ cards, message: 'Карточки успешно получены' }); })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))
    .then((card) => {
      res.send({ card, message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true }).orFail(new Error('NotFound'))
    .then((like) => { res.send({ like, message: 'Like успешно добавлен' }); })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }); }
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Передан несуществующий _id карточки' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true }).orFail(new Error('NotFound'))
    .then((like) => { res.send({ like, message: 'Like успешно удалён' }); })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }); }
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Передан несуществующий _id карточки' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
