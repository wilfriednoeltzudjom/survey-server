const dotenv = require('dotenv');
const path = require('path');

function loadEnvFile(fileName) {
  dotenv.config({
    path: path.join(__dirname, '..', '/_env', `${fileName}.env`),
  });
}

module.exports = { loadEnvFile };
