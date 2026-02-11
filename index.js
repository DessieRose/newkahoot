import { startGameserver } from "./websockets/index.js";

import express from "express";
import path from "path";
import "dotenv/config";

import { dirname } from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";
import session from "express-session";

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "./views");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

import adminRouter from "./routes/adminRouter.js";

app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/game/index.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/game/game.html"));
});

startGameserver(server);
server.listen(port, () => {});
