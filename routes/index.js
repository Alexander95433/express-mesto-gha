const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middleware/auth');
const { login, createUsers } = require('../controllers/users');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) { return value; }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', (celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
})), createUsers);

router.use(auth);

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => { next(new ErrorNotFound('Запрашиваемый ресурс не найден')); });

module.exports = router;
