import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import userRouter from './routes/usersRoute';

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Server is connected at http://${HOST}:${PORT}`);
});
