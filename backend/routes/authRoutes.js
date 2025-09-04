import express from 'express';
import passport from 'passport';

import { configureLocalPassport, configureGooglePassport } from '../config/passport.js';
import { isauthenticated } from '../middleware/isAuthenticatedMiddleware.js';
import {
  logoutController,
  passportLogin,
  passportRedirect,
  passportSignup
} from '../controllers/authControllers.js';

const authRouter = express.Router();

configureLocalPassport(passport);
configureGooglePassport(passport);

authRouter.get('/logout', logoutController);
authRouter.post('/signin', passportLogin);
authRouter.post('/signup', passportSignup);
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/oauth2/redirect/google', passport.authenticate('google'), passportRedirect);

authRouter.get('/isAuthenticated', isauthenticated, (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'No authenticated user!' });
  }
});

export default authRouter;
