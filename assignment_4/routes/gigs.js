import express from 'express';
import { Gig } from '../models/Gig';

const router = express.Router();

router.get('/gigs', async (req, res) => {
  const getAllGigs = await Gig.findAll();

  console.log(getAllGigs);
  res.sendStatus(200);
});

export default router;
