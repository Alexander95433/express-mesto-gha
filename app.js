const express = require('express');
// const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const { login, createUsers } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const cenralErrors = require('./middleware/centralError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

// app.use(cookieParser());

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.post('/signin', login);

app.post('/signup', createUsers);

app.use(auth);

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use('*', (req, res) => { res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }); });

app.use(cenralErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Порт ${PORT}`);
});
