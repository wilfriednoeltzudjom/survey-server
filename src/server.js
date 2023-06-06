const webServer = require('./infrastructure/web_server');
const logger = require('./infrastructure/logger');
const envHelper = require('./application/_helpers/env.helper');
const databaseHelper = require('./application/_helpers/database.helper');

function setupEnvironmentVariables() {
  envHelper.loadEnvFile('default');
  envHelper.loadEnvFile(process.env.NODE_ENV);
}

function setupLogger() {
  if (process.env.NODE_ENV === 'production') {
    logger.setupLoggerForProduction();
  }
}

function startServer() {
  setupEnvironmentVariables();
  setupLogger();

  const PORT = process.env.PORT || process.env.SERVER_PORT;
  webServer
    .start(PORT)
    .then(() => {
      logger.info(`Server has started on port ${PORT}`);

      databaseHelper
        .connectDatabase()
        .then(() => {
          logger.info(`Successfully connected to database at uri: ${process.env.MONGODB_URI}`);
        })
        .catch((error) => {
          logger.error(error.message);
        });
    })
    .catch((error) => {
      logger.error(error.message);
    });
}
startServer();
