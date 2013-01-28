/**
 * @fileoverview Default configurations.
 */

/**
 * Module dependencies.
 */

var path = require('path');


/**
 * Public
 */

module.exports = {
  App: {
    PROTOCOL: 'http',
    HOST: 'localhost',
    PORT: 3000,
    ROOT_DIR: path.join(__dirname, '/..'),
    SECRET: 'APP_SECRET_IS_HERE'
  },
  MongoDB: {
    URL: 'mongodb://localhost/sample'
  },
  OAuth: {
    CLIENT_ID: 'Please fill me',
    CLIENT_SECRET: 'Please fill me',
    CALLBACK_URL: '/auth/github/callback',
    ADMINISTRATORS: []
  },
  LOG: {
    LEVEL: 'info',
    FILE: path.join(__dirname, '../logs/app.log'),
    ACCESS_FILE: path.join(__dirname, '../logs/app-access.log'),
    EXCEPTION_FILE: path.join(__dirname, '../logs/app-error.log'),
    MAXSIZE: 104857600,
    MAXFILES: 3
  }
};
