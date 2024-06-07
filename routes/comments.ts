import express from 'express';
import { getDatabase } from '../db';

const router = express.Router();

interface Post {
  id: number;
  name: string;
  content: string;
  date: string;
  time: string;
  author: string;
  topic: string;
  replies: number;
  lastReply: {
    author: string;
    date: string;
    time: string;
  };
}

interface FullPost {
  id: number;
  name: string;
  content: string;
  date: string;
  time: string;
  author: string;
  topic: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
  created_date: string;
  created_time: string;
}

interface DbPost {
  id: number;
  author: number;
  forum: number;
  title: string;
  content: string;
  last_comment_id: number | null;
  comment_amount: number;
  created_date: string;
  created_time: string;
}

interface DbUser {
  id: number;
  username: string;
  password: string;
  created: string;
}

interface DbTopic {
  id: number;
  name: string;
  description: string;
  created: string;
}

interface DbComment {
  id: number;
  author: number;
  post: number;
  content: string;
  created_date: string;
  created_time: string;
}

router.get('/', async (_req, res) => {
  try {
    const db = getDatabase();

    const comments = await db.all('SELECT * FROM comments');
    res.send(comments);
  } catch (error) {}
});

router.post('/add', async (req, res) => {
  const db = getDatabase();
  const { author, threadId, content } = req.body;
  if (!author || !threadId || !content) {
    res.status(400).send();
  }

  let user: DbUser | undefined;

  try {
    //get the userID from users
    user = await db.get('SELECT * FROM users WHERE username=?', [author]);

    if (!user) {
      res.status(401).send('user not found');
    }

    //add the comment to the database

    await db.run(
      'INSERT INTO comments (author, post, content) VALUES (?,?,?)',
      [user?.id, threadId, content]
    );

    const newCommentId = await db.get('SELECT last_insert_rowid() as id');

    //update the reply counter inside correct post
    await db.run(
      'UPDATE posts SET comment_amount = comment_amount + 1 WHERE id=?',
      [threadId]
    );

    //update lastReply in post
    await db.run('UPDATE posts SET last_comment_id = ? WHERE id=?', [
      newCommentId?.id,
      threadId,
    ]);

    res.status(201).send();
  } catch (error) {
    res.status(400).send(`${author}, ${threadId}, ${content}, ${user?.id}`);
  }
});

export default router;
