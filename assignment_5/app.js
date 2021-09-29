import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

import { db } from './config/db';
import routes from './routes/index';

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();

class Server {
  constructor() {
    this.authenticateDB();
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
  }

  routes() {
    app.use(routes);
  }

  start() {
    app.listen(PORT, () => {
      console.log(`Server is connected at http://${HOST}:${PORT}`);
    });
  }
}

const listen = new Server();
listen.assigns();
listen.middlewares();
listen.routes();
listen.start();
