import path from 'path';
import express from 'express';
import multer from 'multer';

import userMethods from '../controller/usersController';

const router = express.Router();
/* eslint-disable */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'views/documents'));
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + originalname)
  }
});
/* eslint-enable */
const uploads = multer({ storage });

router.get('/', userMethods.getallUsers);
router.get('/signup', userMethods.signup);

router.post(
  '/newUser',
  uploads.single('docs'),
  userMethods.validateData(),
  userMethods.addnewUser
);

router.get('/login', (req, res) => {
  res.render('login', { error: '', msg: '' });
});

router.post('/login', userMethods.loginUser);

export default router;
