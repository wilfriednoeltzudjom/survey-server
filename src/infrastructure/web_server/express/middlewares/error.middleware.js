const { isJSONString } = require('../../../../application/_helpers/dataValidator.helper');
const { HttpResponse } = require('../../../../application/payloads');
const errorParser = require('../../../error_parser');
const logger = require('../../../logger');

module.exports = function (err, _req, res, _next) {
  const message = err.message;
  const response = {};
  if (isJSONString(message)) response.data = JSON.parse(message);
  else response.message = message;
  if (err.name === 'ValidationError') response.status = 400;

  const httpResponse = HttpResponse.fromJSON(
    {
      status: err.status || 500,
      success: false,
      ...response,
    },
    { serialize: false }
  );
  if (httpResponse.status === 500) logger.error(errorParser.parseErrorAsString(err));

  res.status(httpResponse.status).send(httpResponse.toJSON());
};
