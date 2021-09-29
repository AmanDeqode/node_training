import { check, validationResult } from 'express-validator';

import Employee from '../models/Employee';

class Credentials {
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
        where: { email: email, password: password },
      });

      console.log(validEmployee);
      if (!validEmployee) {
        return res.render('login', { error: 'Invalid email id or password' });
      }
      const allEmployees = await Employee.findAll();
      return res.render('home', { allEmployees, msg: 'Loggedin Successfully' });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static loginPage = (req, res) => res.render('login', { error: '', msg: '' });
}
export default Credentials;
