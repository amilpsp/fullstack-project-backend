import cors from "cors";
import express from "express";
import * as sqlite from "sqlite";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

const port = 10000;

let database: Database;

(async () => {
  database = await sqlite.open({
    driver: sqlite3.Database,
    filename: "test.sqlite",
  });

  await database.run("PRAGMA foreign_keys = ON");

  console.log("Databas redo");
})();

const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello there");
});
/*
import postsRouter from "./routes/posts";

app.use("/postsRouter", postsRouter);
*/
app.listen(port);
