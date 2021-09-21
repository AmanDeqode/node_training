import express from 'express';
import { check } from 'express-validator';

import userController from '../controller/usersController';

const router = express.Router();

router.get('/', userController.getallUsers);
router.get('/signup', userController.signup);

router.post(
  '/newUser',
  [
    check('username', 'Username must be required').not().isEmpty(),
    check('email', 'Please enter the valid email').isEmail(),
    check('password', 'Please enter the valid password').isLength({ min: 8 }),
  ],
  userController.addnewUser
);

router.get('/login', (req, res) => {
  res.render('login', { error: '', msg: '' });
});

router.post('/login', userController.loginUser);

export default router;
