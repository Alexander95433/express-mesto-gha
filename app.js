const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// const { celebrate, Joi } = require('celebrate');
// const validator = require('validator');
const { errors } = require('celebrate');

// const auth = require('./middleware/auth');
// const { login, createUsers } = require('./controllers/users');
// const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');
const cenralErrors = require('./middleware/centralError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

const routers = require('./routes/index');

app.use(routers);

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().custom((value, helpers) => {
//       if (validator.isEmail(value)) { return value; }
//       return helpers.message('Некорректный email');
//     }),
//     password: Joi.string().required(),
//   }),
// }), login);

// app.post('/signup', (celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().custom((value, helpers) => {
//       if (/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/.test(value)) {
//         return value;
//       }
//       return helpers.message('Некорректная ссылка');
//     }),
//     email: Joi.string().required().custom((value, helpers) => {
//       if (validator.isEmail(value)) {
//         return value;
//       }
//       return helpers.message('Некорректный email');
//     }),
//     password: Joi.string().required(),
//   }),
// })), createUsers);

// app.use(auth);

// app.use('/users', usersRouter);

// app.use('/cards', cardsRouter);

//
app.use(errors());

app.use(cenralErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Порт ${PORT}`);
});
