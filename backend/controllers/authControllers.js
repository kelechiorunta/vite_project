import passport from 'passport';

export const passportLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ error: info?.message || 'Unauthorized' });
    }

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login error' });

      req.session.user = user;
      req.session.authenticated = true;
      return res.json({ message: 'Login successful', user: user });
    });
  })(req, res, next);
};

export const logoutController = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};
