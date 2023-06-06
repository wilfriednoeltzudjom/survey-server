const express = require('express');

const { authController } = require('../../../../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const { HttpRequest } = require('../../../../application/payloads');
const { TOKEN_COOKIE, COOKIE_MAX_AGE } = require('../../../../application/_helpers/constants');

const router = express.Router();

function setSignInCookies(res, response) {
  const cookiesOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
  if (process.env.NODE_ENV !== 'development') {
    cookiesOptions.sameSite = 'none';
    cookiesOptions.secure = true;
  }
  res.cookie(TOKEN_COOKIE, response.data.token, cookiesOptions);
}

router.post('/sign-in', (req, res, next) => {
  authController
    .signIn(HttpRequest.fromExpress(req))
    .then((response) => {
      setSignInCookies(res, response);
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

router.post('/sign-up', (req, res, next) => {
  authController
    .signUp(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

router.get('/profile', authMiddleware, (req, res, next) => {
  authController
    .getProfile(HttpRequest.fromExpress(req))
    .then((response) => {
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

router.put('/sign-out', authMiddleware, (req, res, next) => {
  authController
    .signOut(HttpRequest.fromExpress(req))
    .then((response) => {
      res.clearCookie(TOKEN_COOKIE);
      res.status(response.status).json(response.toJSON());
    })
    .catch(next);
});

module.exports = router;
