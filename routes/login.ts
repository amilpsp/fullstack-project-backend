import express from "express";
import { getDatabase } from "../db";
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/", async (_req, res) => {
	const db = getDatabase();
	const { user_id, username, token } = _req.body;
	try {
		await db.get("SELECT * FROM tokens WHERE token=?", [token]);
		res.status(200).json({ user_id, username, token });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
	
});

router.post("/", async (_req, res) => {
	try {
		const db = getDatabase();

		const { username, password } = _req.body;
		const token = uuidv4();

		if (!username || !password) {
			return res.status(400).json();
		}
		try {
			const user = await db.get(
				"SELECT id, username, password FROM users WHERE username =?",
				[username]
			);
			if (!user || user.password !== password) {
				return res.sendStatus(401);
			}
			await db.run("INSERT INTO tokens (user_id, token) VALUES (?,?)", [
				user.id,
				token,
			]);
			const user_id = user.id;

			res.status(201).json({ user_id, username, token });
		} catch (error) {
			res.send("Nope");
		}
	} catch (error) {}
});

router.delete("/", async (_req, res) => {
	try {
		const db = getDatabase();
		const { user_id, token } = _req.body;
		if (!token || !user_id) {
			return res.status(400).json();
		}
		try {
			await db.run("DELETE FROM tokens WHERE token =?", [token]);
			return res.status(200).send("you've been logged out");
		} catch (error) {
			res.send("something went wrong");
		}
	} catch (error) {
		res.sendStatus;
	}
});

export default router;
