const mongoose = require('mongoose');

const BadRequestError = require('../errors/BadRequestError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const CardDeletionError = require('../errors/CardDeletionError');

const Card = require('../models/card');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(201).send({ card }); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cards) => {
      if (!cards.owner.equals(req.user._id)) { throw (new CardDeletionError('Попытка удалить чужую карточку')); }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((removeCard) => { res.send(removeCard); });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return next(new BadRequestError('Переданы некорректные данные при удалении карточки')); }
      if (err.name === 'CastError') { return next(new BadRequestError('Переданы некорректные данные при удалении карточки')); }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => { next(new ErrorNotFound('Передан несуществующий _id карточки')); })
    .then((like) => {
      if (!like) { throw new ErrorNotFound('Карточка с указанным _id не найдена.'); }
      res.send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) { return next(new BadRequestError('Переданы некорректные данные при установке лайка')); }
      if (err.name === 'CastError') { return next(new BadRequestError('Не удалось поставить like. Переданы не корректные данные')); }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => {
      if (!like) { throw new ErrorNotFound('Карточка с указанным _id не найдена.'); }
      res.send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при удаление лайка'));
      }
      if (err.name === 'CastError') { return next(new BadRequestError('Не удалось удалить like. Переданы не корректные данные')); }
      return next(err);
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
