require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorMy = require('./middlewares/errors');
const router = require('./routes/index');
const { limiter } = require('./config/limiter');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, MONGODB } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGODB : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(cors);
app.use(helmet());

app.use('/api', router);

app.use(errorLogger);
app.use(errors());
app.use(errorMy);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
