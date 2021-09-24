import express from 'express';
import usersRoute from './usersRoute';

const router = express.Router();

router.use('/', usersRoute);

export default router;
