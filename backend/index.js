import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import rateLimitMiddleware from './middleware/rateLimitMiddleware.js';
import graphqlMiddlewareHandler from './graphql/graphqlHTTPHandler.js';
import authRouter from './routes/authRoutes.js';
import { connectDB } from './config/db.js';
import configureSocket from './config/socket.js';

dotenv.config();

const app = express();
// const filename = fileURLToPath(import.meta);
console.log(path.resolve(import.meta.dirname, '..', 'frontend', 'index.html'));
const indexFilePath = path.resolve(import.meta.dirname, '..', 'frontend');

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

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(false, new Error('Domain not supported'));
    }
  },
  method: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(indexFilePath));

// Handles rate limits per user
app.use(rateLimitMiddleware);

// Handles all auth routes
app.use('/proxy/auth', authRouter);

// Handles all graphql queries and mutations
app.use('/graphql', graphqlMiddlewareHandler);

app.get('/', (req, res) => {
  res.sendFile(path.join(indexFilePath, 'index.html'));
});

app.get('/proxy/api', (req, res, next) => {
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

configureSocket(app, corsOptions);

app.use((req, res, next) => {
  console.log('session no is ', req.session.no);
  res.json({ message: 'Proxy is activated.', user: req.user, no: req.session.no });
});

app.use((err, req, res, next) => {
  console.error(err);
  next(err || { message: 'Something went wrong' });
});

const PORT = process.env.PORT || 3302;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
  })
  .catch((err) => console.error(err));
