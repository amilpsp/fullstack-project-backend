import * as sqlite from "sqlite";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

let database: Database;

export const startDatabase = async () => {
  if (!database) {
		database = await sqlite.open({
			driver: sqlite3.Database,
			filename: "database.sqlite",
		});

		await database.run("PRAGMA foreign_keys = ON");
		console.log("Empty database created");

		/* trying off the top of my head, didn't work [clownEmoji] */
		try {
			await database.run(".read DBsetup.sql");
			console.log("Database ready");
		} catch (error) {
			console.log("Couldn't read DBsetup.sql");
			console.error(error);
		}
		/* syntax error */
	}

  return database;
};

export const getDatabase = () => {
  if (!database) {
    throw new Error("Database not started. Call startDatabase first.");
  }
  return database;
};
