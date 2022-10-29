const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.use((req, res, next) => {
  req.user = {
    _id: '6345a04ed7c49939ecff812a',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => { res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }); });

app.listen(PORT, () => {
  console.log(`Порт ${PORT}`);
});
