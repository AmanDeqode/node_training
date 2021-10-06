import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import Employee from '../models/Employee';

class Credentials {
  static checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/employees');
    }
    next();
  }

  static validateData = () => [
    check('email', 'Please enter the valid email').isEmail(),
    check(
      'password',
      'Please enter password with min length of 8 character'
    ).exists(),
  ];

  static loginEmployee = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const validEmployee = await Employee.findOne({
        where: { email: email },
      });
      if (!validEmployee) {
        return res.render('login', { error: 'Invalid email id' });
      }
      const isMatch = await bcrypt.compare(password, validEmployee.password);
      if (!isMatch) return res.render('login', { error: 'Invalid password' });
      return res.render('home', { msg: 'Loggedin Successfully' });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static logout = (req, res) => {
    req.logout();
    return res.render('login', { error: '', msg: 'Logged Out Successfully' });
  };

  static loginPage = (req, res) => res.render('login', { error: '', msg: '' });
}
export default Credentials;
