import express from "express";
import { getDatabase } from "../db";
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/", async (_req, res) => {
	const db = getDatabase();
	const { token } = _req.body;
	try {
		await db.get("SELECT * FROM tokens WHERE token=?", [
			token,
		]);
		res.status(200).send(token);
	} catch (error) {}
});

router.post("/", async (_req, res) => {
	try {
		const db = getDatabase();

		const { username, password } = _req.body;
		const token = uuidv4();

		if (!username || !password) {
			return res.status(400).send("please enter both username and password");
		}
		try {
			const user = await db.get(
				"SELECT id, username, password FROM users WHERE username =?",
				[username]
			);
			if (!user || user.password !== password) {
				return res.status(401).send("Incorrect username or password");
			}
			try {
				await db.run("INSERT INTO tokens (user_id, token) VALUES (?,?)", [
					user.id,
					token,
				]);
			} catch (error) {
				console.log(error);
				res.status(400).send("couldn't create your login token, please try again later");
			}
			const user_id = user.id;

			res.status(201).json({ user_id, username, token });
		} catch (error) {
			res.send("couldn't find that username in our database");
		}
	} catch (error) {}
});

router.delete("/", async (_req, res) => {
	try {
		const db = getDatabase();
		const { user_id, token } = _req.body;
		if (!token || !user_id) {
			return res.status(404).send("we can't find your id or token in your local storage, please try again");
		}
		try {
			await db.run("DELETE FROM tokens WHERE token =?", [token]);
			return res.status(200).send("you've been logged out");
		} catch (error) {
			console.log(error);
			res.status(400).send("Couldn't log you out");
		}
	} catch (error) {
		console.log(error);
		res.send("something went wrong logging you out, sorry");
	}
});

export default router;
