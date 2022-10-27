const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { defaultUserId } = require('./middleware/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.use('/users', defaultUserId, usersRouter);
app.use('/cards', defaultUserId, cardsRouter);
app.use('*', (req, res) => { res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }); });

app.listen(PORT, () => {
  console.log(`Порт ${PORT}`);
});
