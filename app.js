const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const corsConfiguration = require('./middleware/cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const cenralErrors = require('./middleware/centralError');
const routers = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());

app.use(express.json());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.use(requestLogger);

app.use('*', cors(corsConfiguration));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер успешно упал');
  }, 0);
});

app.use(routers);

app.use(errorLogger);

app.use(errors());

app.use(cenralErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Порт ${PORT}`);
});
