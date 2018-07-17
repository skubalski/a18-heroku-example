const router = require('express').Router();
const assetRouter = require('./asset');

router.use('/asset', assetRouter);

module.exports = router;
