import fs from 'fs';
import path from 'path';
import { check, validationResult } from 'express-validator';

import users from '../views/users.json';

class User {
  saveUser(userData) {
    const newUser = userData.body;
    if (userData.file) {
      newUser.docs = userData.file.filename;
    }
    const totalUsers = users.length;
    newUser.id = totalUsers + 1;
    users.push(newUser);

    fs.writeFile(
      path.join(__dirname, '..', 'views/users.json'),
      JSON.stringify(users),
      (error) => {
        if (error) {
          return error.message;
        }
        console.log('Data has been stored into the file successfully');
      }
    );
    return users;
  }

  getallUsers(req, res) {
    res.render('home', { users, msg: '', error: '' });
  }

  signup(req, res) {
    res.render('signup', { error: '', msg: '' });
  }

  validateData = () => [
    check('username', 'Username must be required').not().isEmpty(),
    check('email', 'Please enter the valid email').isEmail(),
    check(
      'password',
      'Please enter password with min length of 8 character'
    ).isLength({ min: 8 }),
  ];

  addnewUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { error: errors.array(), msg: '' });
    }
    const { email } = req.body;
    const existingUser = users.filter((user) => user.email === email);

    if (existingUser.length !== 0) {
      return res.render('signup', {
        error: '',
        msg: 'Email id already exists',
      });
    }
    this.saveUser(req);

    return res.render('home', { users, msg: 'User has been successfully' });
  };

  loginUser = (req, res) => {
    const { email, password } = req.body;
    const validUser = users.some(
      (user) => user.email === email && user.password === password
    );

    if (validUser) {
      return res.render('home', { users, msg: 'Loggedin Successfully' });
    }
    return res.render('login', { error: 'Invalid email id or password' });
  };
}

const userMethods = new User();

export default userMethods;
