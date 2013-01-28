/**
 * @fileoverview Non authenticatin views.
 */


/*
 * GET /
 */
exports.login = function(req, res) {
  res.render('login', {title: 'Sample app'});
};


/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
