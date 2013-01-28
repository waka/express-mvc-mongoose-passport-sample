/**
 * @fileoverview Top page.
 */

/**
 * GET /home
 */
exports.index = function(req, res) {
  res.render('home', {title: 'Dashboard'});
};
