const bcrypt = require('./bcrypt');
const jsonwebtoken = require('./jsonwebtoken');

module.exports = { ...bcrypt, ...jsonwebtoken };
