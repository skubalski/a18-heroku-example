const Promise = require('bluebird');

const pgp = require('pg-promise')({
  promiseLib: Promise
});

const db = pgp(process.env.DATABASE_URL);

module.exports = db;
