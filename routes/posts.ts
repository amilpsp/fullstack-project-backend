import express from "express";
import { getDatabase } from "../db";
const router = express.Router();

interface Post {
  id: number;
  name: string;
  content: string;
  date: string;
  time: string;
  originalPoster: string;
  topic: string;
  replies: number;
  lastReply: {
    name: string;
    date: string;
    time: string;
  };
}

interface dbPost {
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

interface dbUser {
  id: number;
  username: string;
  email: string;
  password: string;
  created: string;
}

interface dbTopic {
  id: number;
  name: string;
  description: string;
  created: string;
}

interface dbComment {
  id: number;
  author: number;
  post: number;
  content: string;
  created_date: string;
  created_time: string;
}

router.get("/", async (req, res) => {
  let formattedPosts: Post[] = [];
  try {
    const db = getDatabase();
    let posts: dbPost[] = [];

    //if no queries
    if (!req.query.topic && !req.query.id) {
      posts = await db.all<dbPost[]>(
        "SELECT * FROM posts ORDER BY created_date ASC, created_time ASC"
      );
    }

    //if topic query is passed
    if (req.query.topic) {
      posts = await db.all<dbPost[]>(
        "SELECT * FROM posts WHERE forum=? ORDER BY created_date ASC, created_time ASC",
        [req.query.topic]
      );
    }

    //if id query is passed
    if (req.query.id) {
      posts = await db.all<dbPost[]>(
        "SELECT * FROM posts WHERE author=? ORDER BY created_date ASC, created_time ASC",
        [req.query.id]
      );
    }

    // iterate through the posts to format them according to the interface
    for (let post of posts) {
      const author: dbUser = (await db.get("SELECT * FROM users WHERE id=? ", [
        post.author,
      ])) ?? {
        id: 0,
        username: "[deleted]",
        email: "[deleted]",
        password: "",
        created: "",
      };

      const topic: dbTopic = (await db.get("SELECT * FROM forums WHERE id=?", [
        post.forum,
      ])) ?? {
        id: 0,
        name: "uncategorized",
        description: "uncategorized",
        created: "",
      };

      const lastComment: dbComment = (await db.get(
        "SELECT * FROM comments WHERE id=?",
        [post.last_comment_id]
      )) ?? {
        id: 0,
        author: post.author,
        post: post.id,
        content: post.content,
        created_date: post.created_date,
        created_time: post.created_time,
      };

      const lastCommentAuthor: dbUser = (await db.get(
        "SELECT * FROM users WHERE id=?",
        [lastComment.author]
      )) ?? {
        id: 0,
        username: "[deleted]",
        email: "[deleted]",
        password: "",
        created: "",
      };

      let newPost: Post = {
        id: post.id,
        name: post.title,
        content: post.content,
        date: post.created_date,
        time: post.created_time,
        originalPoster: author.username,
        topic: topic.name,
        replies: post.comment_amount,
        lastReply: {
          name: lastCommentAuthor.username,
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

export default router;
