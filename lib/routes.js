/**
 * @fileoverview URL routes.
 */


/**
 * Module dependencies.
 */

var passport = require('passport')
  , config = require('config')
  , filter = require('./middlewares/routing_filter');


/**
 * Public
 */

exports.draw = function(app) {
  // auth routes
  var auth = require(config.App.ROOT_DIR + '/app/controllers/auth');
  app.get('/login', auth.login);
  app.get('/auth/github', passport.authenticate('github', {failureRedirect: '/login'}),
    function(req, res) {
    }
  );
  app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), 
    function(req, res) {
      res.redirect('/');
    }
  );
  app.get('/logout', auth.logout);

  // top routes
  var home = require(config.App.ROOT_DIR + '/app/controllers/home');
  app.get('/', filter.isAuthenticated, home.index);

  // users routes
  var users = require(config.App.ROOT_DIR + '/app/controllers/users');
  app.get('/users', filter.isAuthenticated, users.index);
};
