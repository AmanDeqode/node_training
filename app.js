import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

import userRouter from './routes/usersRoute';

dotenv.config();

const { PORT, HOST } = process.env;

/*eslint-disable */
const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, path.join(__dirname,'views/documents'));
  },
  filename: (req,file,cb) => {
    console.log(file);
    const {originalname} = file;
    cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + originalname)
  }
});
/*eslint-enable */

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ storage }).single('docs'));

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Server is connected at http://${HOST}:${PORT}`);
});
