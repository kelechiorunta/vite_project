import express from 'express';
import passport from 'passport';

import { configureLocalPassport } from '../config/passport.js';
import { isauthenticated } from '../middleware/isAuthenticatedMiddleware.js';
import { logoutController, passportLogin } from '../controllers/authControllers.js';

const authRouter = express.Router();

configureLocalPassport(passport);

authRouter.get('/logout', logoutController);
authRouter.post('/signin', passportLogin);

authRouter.get('/isAuthenticated', isauthenticated, (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'No authenticated user!' });
  }
});

export default authRouter;
