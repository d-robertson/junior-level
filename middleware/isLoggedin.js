module.exports = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'you need to log in');
    res.redirect('/auth/login');
  }
};

