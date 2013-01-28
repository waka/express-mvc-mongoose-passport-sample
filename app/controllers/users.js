/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User');


/*
 * GET users listing.
 */

exports.index = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      throw err;
    }
    res.render('users/index', {
      title: 'Users',
      users: users
    });
  });
};
