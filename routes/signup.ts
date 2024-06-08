import express from 'express';
import { getDatabase } from '../db';
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/', async (_req, res) => {
  try {
    const db = getDatabase();

    const { username, password } = _req.body;
    const token = uuidv4();

    if (!username || !password) {
      return res.status(400).json();
    }
    try {
      await db.run('INSERT INTO users (username, password) VALUES (?,?)', [
        username,
        password,
      ]);
    } catch (error) {
      res.status(400).send('that username is already taken');
    }
    try {
      /* need to check that the username is indeed unique to let the user know if that's the reason why they couldn't create that account */
      const user = await db.get(
        'SELECT id, username, password FROM users WHERE username =?',
        [username]
      );
      await db.run('INSERT INTO tokens (user_id, token) VALUES (?,?)', [
        user.id,
        token,
      ]);
      const user_id = user.id;

      res.status(201).json({
        user_id,
        username,
        password,
        token,
      });
    } catch (error) {
      res.status(400).send('something went wrong');
    }
  } catch (error) {}
});

export default router;
