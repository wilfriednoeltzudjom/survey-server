const AUTHENTICATION_MESSAGES = require('./authentication');
const SURVEY_MESSAGES = require('./survey');

module.exports = { ...AUTHENTICATION_MESSAGES, ...SURVEY_MESSAGES };
