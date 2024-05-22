import express from "express";
import { getDatabase } from "../db";
const router = express.Router();

interface Post {
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

router.get("/", async (req, res) => {
  let formattedPosts: Post[] = [];
  try {
    const db = getDatabase();
    let posts: dbPost[];

    if (req.query.topic) {
      posts = await db.all(
        "SELECT * FROM posts WHERE forum=? ORDER BY created_date ASC, created_time ASC",
        [req.query.topic]
      );
    } else {
      posts = await db.all(
        "SELECT * FROM posts ORDER BY created_date ASC, created_time ASC"
      );
    }

    // iterate through the posts to format them according to the interface
    for (let post of posts) {
      const author = await db.get("SELECT * FROM users WHERE id=? ", [
        post.author,
      ]);
      const topic = await db.get("SELECT * FROM forums WHERE id=?", [
        post.forum,
      ]);
      const lastComment = (await db.get("SELECT * FROM comments WHERE id=?", [
        post.last_comment_id,
      ])) ?? {
        id: 0,
        author: author.username,
        post: post.id,
        content: post.content,
        created_date: post.created_date,
        created_time: post.created_time,
      };

      let newPost: Post = {
        name: post.title,
        content: post.content,
        date: post.created_date,
        time: post.created_time,
        originalPoster: author.username,
        topic: topic.name,
        replies: post.comment_amount,
        lastReply: {
          name: lastComment.author,
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
