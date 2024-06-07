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

interface UserInfo {
  name: string;
  posts: Post[];
}

interface DbUser {
  id: number;
  username: string;
  password: string;
  created: string;
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

//sends a list of all users REMOVE LATER
router.get('/', async (_req, res) => {
  try {
    const db = getDatabase();
    const users = await db.all('SELECT * FROM users');
    res.send(users);
  } catch (error) {}
});

//sends user and their related threads to frontend
router.get('/:username', async (req, res) => {
  const db = getDatabase();

  if (!req.params.username) {
    res.status(404).send();
    return;
  }

  const user: DbUser | undefined = await db.get(
    'SELECT * FROM users WHERE username=?',
    [req.params.username]
  );

  if (!user) {
    res.status(404).send();
    return;
  }

  const userPosts: DbPost[] = await db.all<DbPost[]>(
    'SELECT * FROM posts WHERE author=? ',
    [user.id]
  );

  let formattedPosts: Post[] = [];

  // iterate through the fetched database posts to format them according to the interface
  for (let post of userPosts) {
    const author: DbUser = (await db.get<DbUser>(
      'SELECT * FROM users WHERE id=? ',
      [post.author]
    )) ?? {
      id: 0,
      username: '[deleted]',
      password: '',
      created: '',
    };

    const topic: DbTopic = (await db.get<DbTopic>(
      'SELECT * FROM forums WHERE id=?',
      [post.forum]
    )) ?? {
      id: 0,
      name: 'unassigned',
      description: 'unassigned',
      created: '',
    };

    const lastComment: DbComment = (await db.get<DbComment>(
      'SELECT * FROM comments WHERE id=?',
      [post.last_comment_id]
    )) ?? {
      id: 0,
      author: post.author,
      post: post.id,
      content: post.content,
      created_date: post.created_date,
      created_time: post.created_time,
    };

    const lastCommentAuthor: DbUser = (await db.get<DbUser>(
      'SELECT * FROM users WHERE id=?',
      [lastComment.author]
    )) ?? {
      id: 0,
      username: '[deleted]',
      password: '',
      created: '',
    };

    let newPost: Post = {
      id: post.id,
      name: post.title,
      content: post.content,
      date: post.created_date,
      time: post.created_time,
      author: author.username,
      topic: topic.name,
      replies: post.comment_amount,
      lastReply: {
        author: lastCommentAuthor.username,
        date: lastComment.created_date,
        time: lastComment.created_time,
      },
    };
    formattedPosts.push(newPost);
  }

  const userInfo: UserInfo = {
    name: user.username,
    posts: formattedPosts,
  };

  res.send(userInfo);
});

export default router;
