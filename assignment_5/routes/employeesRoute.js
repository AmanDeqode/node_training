import path from 'path';
import express from 'express';
import multer from 'multer';

import Employee from '../controller/employeesController';
import Credentials from '../controller/loginController';

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
}); /* eslint-enable */
const uploads = multer({ storage });

router.get('/employees', Employee.getallEmployees);
router.get('/signup', Employee.signup);
router.get('/login', Credentials.loginPage);
router.post(
  '/employees',
  uploads.single('document'),
  Employee.validateData(),
  Employee.addEmployee
);
router.post('/login', Credentials.loginEmployee);
router.patch('/employees/:employeeId', Employee.editEmployee);
router.delete('/employees/:employeeId', Employee.deleteEmployee);

export default router;
