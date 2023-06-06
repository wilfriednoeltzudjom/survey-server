const bcrypt = require('bcrypt');

const SALT = 10;

/**
 * Create hash from plain text
 * @param {String} plainText
 * @returns
 */
async function createHash(plainText) {
  return bcrypt.hash(plainText, SALT);
}

/**
 * Compare plain text to hash
 * @param {String} plainText
 * @param {String} hash
 * @returns
 */
async function compare(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

module.exports = { createHash, compare };
