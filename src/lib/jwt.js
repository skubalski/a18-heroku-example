const jwt = require('jsonwebtoken');

const SECRET = process.env.CSV_EXPORT_SECRET || 'test';
const TOKEN_CONFIG = {expiresIn: '1h'};

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    if(token) {
      jwt.verify(token, SECRET, (err, payload) => {
        if(err) {
          console.error(err);
          reject(err);
        } else {
          resolve(payload);
        }
      });
    } else {
      reject();
    }
  });
}

function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, TOKEN_CONFIG, (err, token) => {
      if(err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  verifyToken,
  createToken
};
