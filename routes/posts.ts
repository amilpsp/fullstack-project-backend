import express from "express";
import { getDatabase } from "../db";
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const db = getDatabase();
    const posts = await db.all("SELECT * FROM posts");
    res.send(posts);
  } catch (error) {}
});

export default router;
