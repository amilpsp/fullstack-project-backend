import cors from "cors";
import express from "express";
import { startDatabase } from "./db";
import postsRouter from "./routes/posts";
import forumsRouter from "./routes/forums";
import loginRouter from "./routes/login";
import usersRouter from "./routes/users";
import commentsRouter from "./routes/comments";
const port = 8080;

const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//starting db and defining routes
(async () => {
  await startDatabase();

  app.use("/posts", postsRouter);
  app.use("/forums", forumsRouter);
  app.use("/login", loginRouter);
  app.use("/users", usersRouter);
  app.use("/comments", commentsRouter);
  app.listen(port);
})();

//// TO RUN DBSETUP.SQL WITH CHANGES
/*
in terminal:
sqlite3
.mode markdown
PRAGMA foreign_keys=ON;
.read DBsetup.sql
*/
