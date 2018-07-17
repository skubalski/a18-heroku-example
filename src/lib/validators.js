const {InvalidRequestError} = require('./errors');

function sfidValidator(req, res, next) {
  if (req.params && req.params.id && (req.params.id.length === 15 || req.params.id.length === 18)) {
    next(new InvalidRequestError());
  } else {
    next();
  }
}

module.exports = {
  sfidValidator
};
