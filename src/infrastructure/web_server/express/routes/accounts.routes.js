const express = require('express');

const { authController } = require('../../../../controllers');
const accessRightsMiddleware = require('../middlewares/accessRights.middleware');
const { HttpRequest } = require('../../../../application/payloads');
const { ROLES } = require('../../../../database/enums');

const router = express.Router();

router.get('/', accessRightsMiddleware(ROLES.ADMINISTRATOR), (req, res, next) => {
  authController
    .getAccounts(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

module.exports = router;
