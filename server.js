/**
 * @fileoverview Application bootstrap.
 */


/**
 * Module dependencies.
 */

var http = require('http')
  , config = require('config')
  , Application = require('./lib/application')
  , logger = require('./lib/logger').logger;


/**
 * Create application
 */

var app = /** @type {Express} */Application.create();

/**
 * Server listen
 */

var port = config.App.PORT || 3000;
app.set('port', port);
http.createServer(app).listen(app.get('port'), function() {
  logger.info("Express server listening on port " + app.get('port'));
});
