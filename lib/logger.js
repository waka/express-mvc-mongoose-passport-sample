/**
 * @fileoverview Logger using winston.
 * @author yo_waka
 */

/**
 * Required modules.
 */

var winston = require('winston')
  , config = require('config');


/**
 * Private
 */

// winston transports
var loggerTransports = {
  console: {
    level: config.LOG.LEVEL,
    colorize: true
  },
  file: {
    level: config.LOG.LEVEL,
    timestamp: true,
    filename: config.LOG.FILE,
    maxsize: config.LOG.MAXSIZE,
    maxFiles: config.LOG.MAXFILES
  },
  access: {
    timestamp: false,
    filename: config.LOG.ACCESS_FILE,
    maxsize: config.LOG.MAXSIZE,
    maxFiles: config.LOG.MAXFILES
  },
  exception: {
    timestamp: true,
    json: false,
    prettyPrint: true,
    filename: config.LOG.EXCEPTION_FILE,
    maxsize: config.LOG.MAXSIZE,
    maxFiles: config.LOG.MAXFILES
  }
};

// create instance
var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(loggerTransports.console),
    new winston.transports.File(loggerTransports.file)
  ],
  exitOnError: false,
  exceptionHandlers: [
    new winston.transports.File(loggerTransports.exception)
  ]
});

// use syslog levels
logger.setLevels(winston.config.syslog.levels);

// If production env, remove console logger
if (process.env.NODE_ENV === 'production') {
  logger.remove(winston.transports.Console);
}

// Stream to pass to express logger to log http requests
// See http://stackoverflow.com/questions/9141358/how-do-i-output-connect-expresss-logger-output-to-winston
var loggerStream = {
  write: function (message, encoding) {
    logger.info(message.substring(0, message.length - 1));
  }
};


/**
 * Public
 */

exports.logger = logger;
exports.loggerStream = loggerStream;
exports.loggerTransports = loggerTransports;
