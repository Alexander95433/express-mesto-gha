const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routers = require('./routes/index');
const cenralErrors = require('./middleware/centralError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.use(routers);

app.use(errors());

app.use(cenralErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Порт ${PORT}`);
});
