import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import dotenv from 'dotenv';

import rateLimitMiddleware from './middleware/rateLimitMiddleware.js';

dotenv.config();

const app = express();

const sessionOptions = {
  name: 'user_session',
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
};
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/api', (req, res, next) => {
  try {
    if (!req.session.no) {
      req.session.no = 0;
    }
    req.session.no += 1;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.use(rateLimitMiddleware);

app.use((req, res, next) => {
  console.log('session no is ', req.session.no);
  res.json({ message: 'Proxy is activated.', no: req.session.no });
});

const PORT = process.env.PORT || 3302;

app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
