import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import Employee from '../models/Employee';

class Employees {
  static checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  static validateData = () => [
    check('username', 'Username must be required').not().isEmpty(),
    check('email', 'Please enter the valid email').isEmail(),
    check(
      'password',
      'Please enter password with min length of 8 character'
    ).isLength({ min: 8 }),
    check('docs')
      .custom((value, { req }) => {
        if (req.file.mimetype !== 'application/pdf') {
          return false;
        }
        return true;
      })
      .withMessage('Add document only pdf format allowed'),
  ];

  static getallEmployees = async (req, res) => {
    try {
      const allEmployees = await Employee.findAll({ order: [['id', 'ASC']] });
      res.render('home', { allEmployees, msg: '', error: '' });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static signup = (req, res) => {
    res.render('signup', { error: '', msg: '' });
  };

  static editEmployee = (req, res) => {
    res.render();
  };

  static addEmployee = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('signup', { error: errors.array(), msg: '' });
      }
      const { username, email, password } = req.body;
      const originalname = req.file ? req.file.originalname : null;
      const existingEmployee = await Employee.findOne({
        where: { email: email },
      });
      if (existingEmployee) {
        return res.render('signup', {
          error: '',
          msg: 'Email id already exists',
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await Employee.create({
        username,
        email,
        password: hashedPassword,
        document: originalname,
      });
      const allEmployees = await Employee.findAll();
      return res.render('home', {
        allEmployees,
        msg: 'Employee has been registered successfully',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static editEmployee = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const id = req.params.employeeId;
      const employee = await Employee.findByPk(id);
      employee.username = username || employee.username;
      employee.email = email || employee.email;
      employee.password = password || employee.password;
      const updateEmployee = await employee.save();
      if (!updateEmployee) {
        return new Error('Employee Updation failed');
      }
      return res.status(200).json('Employee has been updated successfully');
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static deleteEmployee = async (req, res) => {
    try {
      const id = req.params.employeeId;
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(400).json({ message: 'Employee not found' });
      }
      const removedSuccessfully = await employee.destroy();
      if (!removedSuccessfully) {
        return res.status(400).json({ message: 'something went wrong' });
      }
      return res.status(200).json({ message: 'employee removed successfully' });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default Employees;
