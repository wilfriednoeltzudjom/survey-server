const { createLogger, format, transports } = require('winston');

const timestamp = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' });

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        timestamp,
        format.printf(({ timestamp, level, message }) => {
          return `[logger] ${timestamp} ${level}: ${message}`;
        })
      ),
    }),
  ],
});

/**
 * Setup logger for production
 */
function setupLoggerForProduction() {
  logger.add(new transports.File({ filename: 'errors.log', level: 'error', format: format.combine(timestamp, format.json()) })).add(
    new transports.File({
      filename: 'combined.log',
      level: 'debug',
      format: format.combine(timestamp, format.json()),
    })
  );
}

/**
 * Log info message
 * @param {String} message
 */
function info(message) {
  logger.info(message);
}

/**
 * Log error message
 * @param {String} message
 */
function error(message) {
  logger.error(message);
}

/**
 * Log warning message
 * @param {String} message
 */
function warning(message) {
  logger.warning(message);
}

module.exports = { setupLoggerForProduction, info, error, warning };
