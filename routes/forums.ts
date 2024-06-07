import express from 'express';
import { getDatabase } from '../db';
const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const db = getDatabase();
    const forums = await db.all('SELECT * FROM forums');
    res.send(forums);
  } catch (error) {}
});

export default router;
