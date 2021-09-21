import fs from 'fs';
import path from 'path';
import { validationResult } from 'express-validator';

import users from '../views/users.json';

function saveUser(userData) {
  const newUser = userData.body;
  newUser.docs = userData.file.filename;
  console.log('newUser', newUser);
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
exports.getallUsers = (req, res) =>
  res.render('home', { users, msg: '', error: '' });

exports.signup = (req, res) => res.render('signup', { error: '', msg: '' });

exports.addnewUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { error: errors.array(), msg: '' });
  }
  const { email } = req.body;
  const existingUser = users.filter((user) => user.email === email);

  if (existingUser.length !== 0) {
    return res.render('signup', { error: '', msg: 'Email id already exists' });
  }
  saveUser(req);

  return res.render('home', { users, msg: 'User has been successfully' });
};
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const validUser = users.some(
    (user) => user.email === email && user.password === password
  );

  if (validUser) {
    return res.render('home', { users, msg: 'Loggedin Successfully' });
  }
  return res.render('login', { error: 'Invalid email id or password' });
};
