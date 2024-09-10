import express from "express";
import morgan from "morgan";

const app = express();

const isDev = process.env.NODE_ENV === "development";

app.use(morgan(isDev ? "dev" : "combined"));

app.get("/health", (req, res) => res.sendStatus(200));

export default app;
