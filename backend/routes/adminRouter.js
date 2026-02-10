import "dotenv/config";
import express from "express";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "../frontend");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../frontend/login.html"));
});

router.post("/login", (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    res.sendFile(path.join(__dirname, "/../../frontend/private/admin.html"));
  } else {
    res.send('Wrong password! <a href="/admin">Try again</a>');
  }
});

export default router;
