import { startGameserver } from "./websockets/index.js";

import express from "express";
import path from "path";

import { dirname } from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "../frontend");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3500;

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

startGameserver(server);
server.listen(port, () => {});
