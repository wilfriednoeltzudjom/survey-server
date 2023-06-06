const uuid = require('uuid');

function generateUniqueId() {
  return uuid.v1();
}

module.exports = { generateUniqueId };
