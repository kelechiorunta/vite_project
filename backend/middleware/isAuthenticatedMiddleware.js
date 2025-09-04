export const isauthenticated = (req, res, next) => {
  try {
    console.log('Authenticated?', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);

    // Check if user is authenticated with Passport
    if (!req.isAuthenticated() || !req.user) {
      return res.redirect('/login');
    }
    next();
  } catch (error) {
    next(error);
  }
};
