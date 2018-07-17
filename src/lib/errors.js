class NotFoundError extends Error {
  code = 404;
}

class UnexpectedError extends Error {
  code = 500;
}

class InvalidRequestError extends Error {
  code = 400;
}

module.exports = {
  NotFoundError,
  UnexpectedError,
  InvalidRequestError
};
