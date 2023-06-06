const { UnauthorizedError } = require('../../../../application/_helpers/errors');
const MESSAGES = require('../../../../application/messages');

module.exports = function (...authorizedRoles) {
  return function (req, _res, next) {
    const { role } = req.user;
    if (!authorizedRoles.includes(role)) {
      throw new UnauthorizedError(MESSAGES.UNAUTHORIZED({ role }));
    }
    next();
  };
};
