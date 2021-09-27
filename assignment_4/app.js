import path from 'path';
import express from 'express';

import routes from './routes/index';

import { db } from './config/db';

const app = express();

const authenticateDB = async () => {
  try {
    await db.authenticate();

    console.log('Connected to the database');
  } catch (error) {
    console.log(new Error(error));
  }
};
authenticateDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(3000, () => {
  console.log(`Server is connected at localhost:3000`);
});
