/**
 * @fileoverview Passport initializer.
 */


/**
 * Module dependencies.
 */

var crypto = require('crypto')
  , passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , config = require('config')
  , logger = require('../logger').logger;


/**
 * Private
 */

// Create OAuth callback URL
var createCallbackURL = function() {
  var baseURL = config.App.PROTOCOL + '://' + config.App.HOST + 
                ':' + config.App.PORT;
  return baseURL + config.OAuth.CALLBACK_URL;
};

// Create avatar image URL
var createAvatarURL = function(gravatar_id) {
  return 'https://secure.gravatar.com/avatar/' + gravatar_id;
};

// Create unique random token
var createRandomToken = function() {
  var size = 24;
  return crypto.randomBytes(Math.ceil(size * 3 / 4))
    .toString('base64').slice(0, size); 
};

// Check whether the user has admin role
var checkAdminUser = function(name) {
  var administrators = config.OAuth.ADMINISTRATORS || [];
  return administrators.indexOf(name) > -1;
};


/**
 * Public
 */

/**
 * @return {void}
 */
exports.initialize = function() {
  // serialize session object
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize session object
  passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, function(err, user) {
      done(err, user);
    })
  });

  // Use GitHub's OAuth
  passport.use('github', new GitHubStrategy({
      clientID: config.OAuth.CLIENT_ID,
      clientSecret: config.OAuth.CLIENT_SECRET,
      callbackURL: createCallbackURL()
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        User.findOne({provider: 'github', uid: profile.id}, function(err, user) {
          if (err) {
            logger.error(err.message);
            done(err, null);
          }

          if (!user) {
            // create if not exists
            user = new User({});
          }
          user.provider = 'github';
          user.uid = profile.id;
          user.name = profile.username;
          user.email = profile.emails[0].value;
          user.image = createAvatarURL(profile._json.gravatar_id);
          if (checkAdminUser(user.name)) {
            user.admin = true;
          }

          // Go
          user.save(function(err) {
            if (err) {
              logger.error(err.message);
            }
            return done(err, user);
          });
        });
      });
    }
  ));
};
