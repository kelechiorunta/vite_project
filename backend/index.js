import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import ConnectMongoDBSession from 'connect-mongodb-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import rateLimitMiddleware from './middleware/rateLimitMiddleware.js';
import graphqlMiddlewareHandler from './graphql/graphqlHTTPHandler.js';
import authRouter from './routes/authRoutes.js';
import { connectDB } from './config/db.js';
import configureSocket from './config/socket.js';
import pictureRouter from './routes/pictureRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3302;

const indexFilePath = path.resolve(import.meta.dirname, '..', 'frontend');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session store configuration
const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 7
  } // Sessions expire after 1 week}
);

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
  },
  store: store
};

// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://justchat-app.vercel.app',
  'https://vite-project-kjia.onrender.com'
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
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
// For static build in production mode
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// //Enable multipart/form-data parsing before graphqlHTTP
// app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 5 }));

// Handles rate limits per user
app.use('/proxy/auth', rateLimitMiddleware);

if (process.env.NODE_ENV === 'production') {
  // Trust production server domain provider (Vercel or Render) as proxy
  app.set('trust proxy', 1);
}

// Handles all auth routes
app.use('/proxy/auth', authRouter);
// Handles all picture streaming
app.use('/proxy/chat-pictures', pictureRouter);

// Handles all graphql queries and mutations
app.use('/graphql', graphqlMiddlewareHandler);

app.get('/*', (req, res) => {
  res.sendFile(path.join(indexFilePath, 'dist', 'index.html'));
});

// Socket.io server configuration
const { server, io } = configureSocket(app, corsOptions);
app.use((err, req, res, next) => {
  console.error(err);
  next(err || { message: 'Something went wrong' });
});

connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected successfully');
    server.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
  })
  .catch((err) => console.error(err));

// Export main file
export default app;
