const express = require('express');

const { authController } = require('../../../../controllers');
const { HttpRequest } = require('../../../../application/payloads');

const router = express.Router();

router.get('/', (req, res, next) => {
  authController
    .getAccounts(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  authController
    .createAccount(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

router.delete('/:accountId', (req, res, next) => {
  authController
    .deleteAccount(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

module.exports = router;
