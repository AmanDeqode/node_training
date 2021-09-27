import express from 'express';
import gigsRouter from './gigs';

const router = express.Router();

router.use('/', gigsRouter);

export default router;
