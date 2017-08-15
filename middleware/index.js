const 
  requiresLogout = (req, res, next) => {
    if (req.session && req.session.userId) {
      res.redirect('/profile');
    } else {
      next();
    }
  },
  requiresLogin = (req, res, next) => {
     if (req.session && req.session.userId) {
      next();
    } else {
      const err = new Error('You must be logged in to view this page.');
      err.status = 401;
      next(err);
    }
  };

module.exports = { requiresLogout, requiresLogin };