const router = require('express').Router();
const csvRouter = require('./csv');
const qrRouter = require('./qr');
const pgDatabase = require('../../../../lib/pg-database');
const uuid = require('uuid');
const {UnexpectedError, InvalidRequestError} = require('../../../../lib/errors');
const _ = require('lodash');

router.post('/', async (req, res, next) => {
  try {
    const keys = Object.keys(req.body || {});
    if (_.isEmpty(keys)) {
      next(new InvalidRequestError());
    }
    const values = keys.map(key => `$[${key}]`);
    const externalId = uuid.v4();
    const query = `INSERT INTO salesforce.asset__c(externalid__c,${keys.join(',')} VALUES($[externalId], ${values.join(',')}))`;
    await pgDatabase.task(t => t.none(query, Object.assign({externalId}, req.body)));
    res.status(201);
    res.json({externalId});
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

router.get('/', async (req, res, next) => {
  try {
    const whereConditions = [];
    for (const key of Object.keys(req.query || {})) {
      whereConditions.push(`${key} = $[${key}]`);
    }
    const query = `SELECT * FROM salesforce.asset__c ${_.isEmpty(whereConditions) ? '' : `WHERE ${whereConditions.join(' AND ')}`}`;
    const results = await pgDatabase.task(t => t.manyOrNone(query, payload));
    res.status(200);
    res.json(results);
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

router.use('/qr', qrRouter);
router.use('/csv', csvRouter);

module.exports = router;

