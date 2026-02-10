import express from "express";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "../frontend");

const app = express();
const port = 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));

import adminRouter from "./routes/adminRouter.js";

app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/game.html"));
});

app.listen(port, () => {});

import { startGameserver } from "./websockets/index.js";
startGameserver();
