const router = require('express').Router();
const csvRouter = require('./csv');
const qrRouter = require('./qr');

router.use('/qr', qrRouter);
router.use('/csv', csvRouter);

module.exports = router

