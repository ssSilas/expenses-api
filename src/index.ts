import "reflect-metadata";
import express from "express";
import { Router, Request, Response } from "express";

import dbInitAndSync from "./server/db/database";
import auth_router from "./server/routes/auth.route";
import createHttpError from "http-errors";
import { configEnv } from "./config/enviroments";

const app = express();
const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world with Typescript" });
});

app.use(route);
app.use("/auth", auth_router);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

const port = configEnv.portApp;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
  dbInitAndSync();
});
