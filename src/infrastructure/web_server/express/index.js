const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const loggingMiddleware = require('./middlewares/logging.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const accessRightsMiddleware = require('./middlewares/accessRights.middleware');
const authRoutes = require('./routes/auth.routes');
const accountsRoutes = require('./routes/accounts.routes');
const surveysRoutes = require('./routes/surveys.routes');

const { isValidValue } = require('../../../application/_helpers/dataValidator.helper');
const { ROLES } = require('../../../database/enums');

const app = express();

function start(port) {
  app.use(loggingMiddleware);
  app.use(cors({ credentials: true, origin: [process.env.FRONT_APP_BASE_URL].filter(isValidValue) }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/v1/auth', authRoutes);
  app.use('/v1/accounts', authMiddleware, accessRightsMiddleware(ROLES.ADMINISTRATOR), accountsRoutes);
  app.use('/v1/surveys', authMiddleware, surveysRoutes);

  app.use(errorMiddleware);

  return new Promise((resolve) => {
    app.listen(port, resolve);
  });
}

module.exports = { start };
