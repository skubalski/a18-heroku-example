const {InvalidRequestError} = require('./errors');

function sfidValidator(req, res, next) {
  if (req.params && req.params.id && req.params.id.length === 18) {
    next();
  } else {
    next(new InvalidRequestError());
  }
}

module.exports = {
  sfidValidator
};
