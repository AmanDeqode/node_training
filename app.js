import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

import routes from './routes/index';

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();

class Server {
  constructor() {
    this.assigns();
    this.middlewares();
    this.routes();
    this.start();
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
listen;
