const BasicError = require('./BasicError');
const BadRequestError = require('./BadRequestError');
const SessionExpiredError = require('./SessionExpiredError');
const ResourceNotFoundError = require('./ResourceNotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const UnsupportedMediaTypeError = require('./UnsupportedMediaTypeError');

module.exports = { BasicError, BadRequestError, SessionExpiredError, ResourceNotFoundError, UnauthorizedError, UnsupportedMediaTypeError };
