class NotFoundError extends Error {
  constructor(...args) {
    super(args);
    this.code = 404;
  }
}

class UnexpectedError extends Error {
  constructor(...args) {
    super(args);
    this.code = 500;
  }
}

class InvalidRequestError extends Error {
  constructor(...args) {
    super(args);
    this.code = 400;
  }
}

module.exports = {
  NotFoundError,
  UnexpectedError,
  InvalidRequestError
};
