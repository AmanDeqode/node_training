import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';

import { db } from './config/db';
import routes from './routes/index';
import initializePassport from './config/passport';

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();

class Server {
  constructor() {
    this.authenticateDB();
    initializePassport(passport);
  }

  async authenticateDB() {
    try {
      await db.authenticate();
      console.log('Connected to the database');
    } catch (error) {
      console.log(new Error(error));
    }
  }

  assigns() {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
  }

  middlewares() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(
      session({
        secret: process.env.SECRETKEY,
        resave: true,
        saveUninitialized: true,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
  }

  routes() {
    app.use(routes);
  }

  start() {
    app.listen(PORT, () => {
      console.log(`Server is connected at http://${HOST}:${PORT}/employees`);
    });
  }
}
const listen = new Server();
listen.assigns();
listen.middlewares();
listen.routes();
listen.start();
