import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

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

app.get('/api', (req, res) => {
  res.json({ message: 'Proxy is activated.' });
});

const PORT = process.env.PORT || 3302;

app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
