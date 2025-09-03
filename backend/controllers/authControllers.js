import passport from 'passport';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

export const emailValidationSchema = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isStrongPassword().withMessage('Must be a strong password')
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const passportSignup = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;

  try {
    if (!username || !password || !confirmPassword || !email) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const newUser = new User({ username: username, password: password, email: email });
    await newUser.save();

    // Optionally log them in immediately:
    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Auto-login failed after signup' });
      return res.status(201).json({ message: 'Signup successful', user: newUser });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during signup' });
  }
};

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
