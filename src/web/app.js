const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const responseTime = require('response-time');
const swaggerUi = require('swagger-ui-dist');
const pathToSwaggerUi = swaggerUi.absolutePath();
const apiRouter = require('./api');
const {NotFoundError} = require('../lib/errors');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(compression());
app.use(responseTime());

app.all('/', (req, res) => res.sendStatus(200));

app.use('/swagger', express.static(pathToSwaggerUi));
app.use('/swagger/config', express.static(path.join(__dirname, '../../swagger-config.yaml')));

app.use('/api', apiRouter);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((err, req, res, next) => res.sendStatus(err.code || 500));

app.listen(PORT, () => console.log(`APP is listening on port: ${PORT}`));
