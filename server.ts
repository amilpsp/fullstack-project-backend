import cors from "cors";
import express from "express";
import * as sqlite from "sqlite";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

const port = 3000;

let database: Database;

(async () => {
  database = await sqlite.open({
    driver: sqlite3.Database,
    filename: "test.sqlite",
  });

  await database.run("PRAGMA foreign_keys = ON");

  console.log("Redo att göra databasanrop");
})();

const app = express();

app.use(cors());

app.listen(port);
