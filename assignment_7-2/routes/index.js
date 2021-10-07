import express from 'express';
import employeesRoute from './employeesRoute';

const router = express.Router();

router.use('/', employeesRoute);

export default router;
