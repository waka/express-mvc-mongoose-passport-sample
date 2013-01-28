/**
 * @fileoverview Routing filters middleware.
 */


// Simple route middleware to ensure user is authenticated.
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
