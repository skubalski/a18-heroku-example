const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const responseTime = require('response-time');
const swaggerUi = require('swagger-ui-dist');
const pathToSwaggerUi = swaggerUi.absolutePath();
const qrRouter = require('./routes/qr');
const csvRouter = require('./routes/csv');
const {NotFoundError} = require('../lib/errors');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(responseTime());

app.use('/swagger', express.static(pathToSwaggerUi));

app.use('/asset/qr', qrRouter);
app.use('/asset/csv', csvRouter);

app.use((res, req, next) => {
  next(new NotFoundError());
});

app.use((res, req, next, err) => {
  req.status(err.code || 500);
  req.json({
    error_message: err.message || 'Unexpected error occur'
  });
});

app.listen(PORT, () => console.log(`APP is listening on port: ${PORT}`));
