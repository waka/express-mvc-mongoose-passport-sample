/**
 * @fileoverview Connect MongoDB, and Setup schemas.
 */


/**
 * Module dependencies.
 */

var fs = require('fs')
  , mongoose = require('mongoose')
  , config = require('config')
  , logger = require('../logger').logger;


/**
 * Public
 */

exports.initialize = function() {
  // establish connection
  mongoose.connect(config.MongoDB.URL, function(err) {
    if (err) {
      logger.error(err.message);
      throw err;
    }
  });

  // Bootstrap models
  var modelsPath = config.App.ROOT_DIR  + '/app/models'
  fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + '/' + file);
  });
};
