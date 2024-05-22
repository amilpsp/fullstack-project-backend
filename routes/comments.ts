import express from "express";
import { getDatabase } from "../db";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const db = getDatabase();

    //get the post id from frontend and send back the comments with the same post id, param or query?

    const comments = await db.all("SELECT * FROM comments");
    res.send(comments);
  } catch (error) {}
});

export default router;
