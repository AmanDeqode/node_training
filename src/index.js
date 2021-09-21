import express from 'express';
import path from 'path';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const home = (req, res) => {
  const { username } = req.cookies;
  return res.render('home', {
    username,
  });
};
const login = (req, res) => {
  const badAuth = !!req.query.msg;

  if (badAuth) {
    return res.render('login', {
      error: 'Invalid username or password',
    });
  }
  return res.render('login');
};
const welcome = (req, res) => {
  const { username } = req.cookies;

  return res.render('welcome', {
    username,
  });
};
const loginProcess = (req, res) => {
  const { username, password } = req.body;

  const userDetails = {
    username: 'Aman Chaudhary',
    password: 'aman12345',
  };

  if (username === userDetails.username && password === userDetails.password) {
    res.cookie('username', username, {
      maxAge: 5000,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.redirect('/welcome');
  }

  return res.redirect('/login?msg=fail');
};
const logout = (req, res) => {
  res.clearCookie('username');
  return res.redirect('/login');
};

app.get('/', home);
app.get('/login', login);
app.get('/welcome', welcome);
app.post('/process_login', loginProcess);
app.get('/logout', logout);

app.listen(PORT, () => {
  console.log(`Server is connected at ${HOST}:${PORT} `);
});
