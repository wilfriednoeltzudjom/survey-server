const { TOKEN_COOKIE } = require('../../../../application/_helpers/constants');
const { isNullishOrEmpty } = require('../../../../application/_helpers/dataValidator.helper');
const { UnauthorizedError } = require('../../../../application/_helpers/errors');
const MESSAGES = require('../../../../application/messages');
const securityUtilities = require('../../../security');

module.exports = function (req, _res, next) {
  const token = extractTokenFromRequest(req);
  securityUtilities.verifyToken(token);
  req.user = securityUtilities.decodeToken(token).payload;
  next();
};

function extractTokenFromRequest(req) {
  const tokenCookie = req.cookies[TOKEN_COOKIE];
  if (isNullishOrEmpty(tokenCookie)) throw new UnauthorizedError(MESSAGES.ACCESS_NOT_ALLOWED);

  return tokenCookie;
}
