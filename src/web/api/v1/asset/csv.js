const router = require('express').Router();
const pgDatabase = require('../../../../lib/pg-database');
const jwt = require('../../../../lib/jwt');
const uuid = require('uuid');
const json2csv = require('json2csv');

router.post('/', async (req, res, next) => {
  try {
    const uuid1 = uuid.v4();
    const uuid2 = uuid.v4();

    await pgDatabase.task(
        t => t.none('INSERT INTO a18.csv_export(uuid1, uuid2, payload) VALUES ($1, $2, $3)', [
          uuid1, uuid2, req.body
        ])
    );

    const token = jwt.createToken({ uuid1, uuid2 });
    res.status(200).json({
      token,
      url: `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}/${token}`
    });
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

router.get('/:token', async (req, res, next) => {
  try {
    const payload = await jwt.verifyToken(req.params.token);
    const whereConditions = [];
    for (const key of Object.keys(payload || {})) {
      whereConditions.push(`${key} = $[${key}]`);
    }
    const query = `SELECT * FROM salesforce.asset__c ${_.isEmpty(whereConditions) ? '' : `WHERE ${whereConditions.join(' AND ')}`}`;
    const results = await pgDatabase.task(t => t.manyOrNone(query, payload));
    const csv = json2csv.parse(results);
    res.status(200);
    res.attachment(`assets_export_${uuid.v4()}.csv`);
    res.send(csv);
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

module.exports = router;
