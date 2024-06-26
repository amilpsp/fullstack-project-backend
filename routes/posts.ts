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

router.get('/:postId', async (req, res) => {
  if (!req.params.postId) {
    res.status(404).send();
  }

  const db = getDatabase();

  const post: DbPost | undefined = await db.get<DbPost>(
    'SELECT * FROM posts WHERE id=?',
    [req.params.postId]
  );

  if (!post) {
    res.status(404).send();
    return;
  }

  const comments: DbComment[] = await db.all<DbComment[]>(
    'SELECT * FROM comments WHERE post=?',
    [post?.id]
  );

  //a for loop to create an array of comments that follow the Comment interface, need to get the author for each from the user table
  let formattedComments: Comment[] = [];

  for (let comment of comments) {
    let commentAuthor: DbUser = (await db.get<DbUser>(
      'SELECT * FROM users WHERE id=?',
      [comment.author]
    )) ?? {
      id: 0,
      username: '[deleted]',
      password: '',
      created: '',
    };

    const formattedComment: Comment = {
      id: comment.id,
      author: commentAuthor.username,
      content: comment.content,
      created_date: comment.created_date,
      created_time: comment.created_time,
    };

    formattedComments.push(formattedComment);
  }

  //get the author through the author id
  const author: DbUser = (await db.get<DbUser>(
    'SELECT * FROM users WHERE id=?',
    [post.author]
  )) ?? {
    id: 0,
    username: '[deleted]',
    password: '',
    created: '',
  };

  //get the correct topic name from the forums table based on post.topic
  const topic: DbTopic = (await db.get<DbTopic>(
    'SELECT * FROM forums WHERE id=?',
    [post.forum]
  )) ?? {
    id: 0,
    name: 'unassigned',
    description: 'unassigned',
    created: '',
  };

  const fullPost: FullPost = {
    id: post.id,
    name: post.title,
    content: post.content,
    date: post.created_date,
    time: post.created_time,
    author: author.username,
    topic: topic.name,
    comments: formattedComments,
  };

  res.send(fullPost);
});

router.get('/', async (req, res) => {
  let formattedPosts: Post[] = [];
  try {
    const db = getDatabase();
    let posts: DbPost[] = [];

    //if no queries, gives all posts
    if (!req.query.topic && !req.query.user) {
      posts = await db.all<DbPost[]>(
        'SELECT * FROM posts ORDER BY created_date DESC, created_time DESC'
      );
    }

    //if topic query is passed, gives all posts from topic
    if (req.query.topic) {
      //get correct forum id
      const topic: DbTopic = (await db.get<DbTopic>(
        'SELECT * FROM forums WHERE name=?',
        [req.query.topic]
      )) ?? {
        id: 0,
        name: 'unassigned',
        description: 'unassigned',
        created: '',
      };

      //get posts from correct forum
      posts = await db.all<DbPost[]>(
        'SELECT * FROM posts WHERE forum=? ORDER BY created_date DESC, created_time DESC',
        [topic.id]
      );
    }

    //if user query is passed, gives all posts by user
    if (req.query.userId) {
      posts = await db.all<DbPost[]>(
        'SELECT * FROM posts WHERE author=? ORDER BY created_date DESC, created_time DESC',
        [req.query.userId]
      );
    }

    // iterate through the fetched database posts to format them according to the interface
    for (let post of posts) {
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

      //get the last comment through its id

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

      let lastCommentAuthor: DbUser;

      if (lastComment.id == 0) {
        lastCommentAuthor = {
          id: post.author,
          username: author.username,
          password: '',
          created: '',
        };
      } else {
        lastCommentAuthor = (await db.get<DbUser>(
          'SELECT * FROM users WHERE id=?',
          [lastComment.author]
        )) ?? {
          id: 0,
          username: '[deleted]',
          password: '',
          created: '',
        };
      }

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

    res.send(formattedPosts);
  } catch (error) {
    console.log(error);
  }
});

router.post('/add', async (req, res) => {
  const db = getDatabase();
  const { author, forum, title, content } = req.body;

  if (!author || !forum || !title || !content) {
    res.status(400).send('missing values');
    return;
  }

  try {
    //get user from username
    const user: DbUser | undefined = await db.get<DbUser>(
      'SELECT * FROM users WHERE username=?',
      [author]
    );

    //get topic from forum name
    const topic: DbTopic | undefined = await db.get<DbTopic>(
      'SELECT * FROM forums WHERE name=?',
      [forum]
    );

    if (!topic || !user) {
      res.status(400).send('didnt find user or topic');
      return;
    }

    //send to database
    await db.run(
      'INSERT INTO posts (author, forum, title, content) VALUES (?,?,?,?)',
      [user.id, topic.id, title, content]
    );

    const newPostId = await db.get('SELECT last_insert_rowid() as id');
    res.status(201).send(newPostId);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
