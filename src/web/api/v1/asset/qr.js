const app = require('express').Router();
const pgDatabase = require('../../../../lib/pg-database');
const S3Helper = require('../../../../lib/s3-helper');
const QrCodeHelper = require('../../../../lib/qr-code-helper');
const _ = require('lodash');
const {NotFoundError, UnexpectedError, InvalidRequestError} = require('../../../../lib/errors');
const {sfidValidator} = require('../../../../lib/validators');

app.get('/:id', sfidValidator, async (req, res, next) => {
  try {
    const qrCode = await pgDatabase.task(
        t => t.oneOrNone('SELECT s3_object_name FROM a18.qr_code WHERE asset = $[assetId]', {assetId: req.params.id})
    );

    if (_.isNil(qrCode)) {
      next(new NotFoundError());
    } else {
      const s3helper = new S3Helper();
      s3helper.connect();
      const content = await s3helper.retrieve(qrCode.s3_object_name);

      res.attachment(qrCode.s3_object_name);
      res.status(200);
      res.send(content);
    }
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

app.post('/:id', sfidValidator, async (req, res, next) => {
  try {
    await pgDatabase.task(async t => {
      const asset = await t.oneOrNone(
          'select * from salesforce.asset__c where sfid = $[assetId]',
          {assetId: req.params.id}
      );
      if (_.isNil(asset)) {
        next(new NotFoundError());
      } else {
        const qrCode = await t.oneOrNone(
            'SELECT s3_object_name FROM a18.qr_code WHERE asset = $[assetId]',
            {assetId: req.params.id}
        );
        if (_.isNil(qrCode)) {
          next(new InvalidRequestError());
        } else  {
          const qrCodeImage = QrCodeHelper.create(asset);

          const s3Helper = new S3Helper();
          s3Helper.connect();
          const name = await s3Helper.upload(qrCodeImage);
          await t.none(
              'INSERT INTO a18.qr_code(asset, s3_object_name) VALUES($[assetId], $[name])',
              {name, assetId: req.params.id}
          );
          res.sendStatus(201);
        }
      }
    });
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

app.put('/:id', sfidValidator, async (req, res, next) => {
  try {
    await pgDatabase.task(async t => {
      const asset = await t.oneOrNone(
          'select * from salesforce.asset__c where sfid = $[assetId]',
          {assetId: req.params.id}
      );
      const qrCode = await t.oneOrNone(
          'SELECT s3_object_name FROM a18.qr_code WHERE asset = $[assetId]',
          {assetId: req.params.id}
      );

      if (_.isNil(asset) || _.isNil(qrCode)) {
        next(new NotFoundError());
      } else {
        const qrCodeImage = QrCodeHelper.create(asset);

        const s3Helper = new S3Helper();
        s3Helper.connect();
        await s3Helper.upload(qrCodeImage, qrCode.s3_object_name);
        res.sendStatus(200);
      }
    });
  } catch (err) {
    next(new UnexpectedError(err));
  }
});

module.exports = app;
