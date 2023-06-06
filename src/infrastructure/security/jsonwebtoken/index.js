const jwt = require('jsonwebtoken');

const MESSAGES = require('../../../application/messages');

const { SessionExpiredError, UnauthorizedError } = require('../../../application/_helpers/errors');

const defaultOptions = {
  issuer: 'survey-bot',
  algorithm: 'RS512',
};

/**
 * Generate authentication token
 * @param {Object} payload
 * @param {Object} options
 * @returns
 */
function generateToken(payload, options = {}) {
  return jwt.sign(payload, formatEnvKey(process.env.PRIVATE_KEY), Object.assign({}, defaultOptions, options));
}

/**
 * Assert a token validity
 * @param {String} token
 */
function verifyToken(token) {
  const { issuer, algorithm } = defaultOptions;

  try {
    jwt.verify(token, formatEnvKey(process.env.PUBLIC_KEY), { issuer, algorithms: [algorithm] });
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new SessionExpiredError(MESSAGES.TOKEN_EXPIRED({ token }));
    throw new UnauthorizedError(MESSAGES.UNRECOGNIZED_TOKEN({ token }));
  }
}

/**
 * Decode a token
 * @param {String} token
 */
function decodeToken(token) {
  return jwt.decode(token, { complete: true });
}

function formatEnvKey(key = '') {
  return key.replace(/\\n/gm, '\n');
}

module.exports = { generateToken, verifyToken, decodeToken };
