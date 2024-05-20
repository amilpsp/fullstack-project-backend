import cors from "cors";
import express from "express";
import { startDatabase } from "./db";
import postsRouter from "./routes/posts";
import forumsRouter from "./routes/forums";
import usersRouter from "./routes/users";

const port = 10000;

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
  app.use("/users", usersRouter);
  app.listen(port);
})();
