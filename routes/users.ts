import express from "express";
import { getDatabase } from "../db";
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const db = getDatabase();
    const users = await db.all("SELECT * FROM users");
    res.send(users);
  } catch (error) {}
});

export default router;
