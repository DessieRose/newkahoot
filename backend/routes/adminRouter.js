import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Admin route - redirect based on auth status
router.get("/", (req, res) => {
  if (req.session.isAdmin) {
    res.sendFile(path.join(__dirname, "/../../frontend/private/admin.html"));
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/login", (req, res) => {
  if (req.session.isAdmin) {
    res.redirect("/admin");
  } else {
    res.sendFile(path.join(__dirname, "/../../frontend/login.html"));
  }
});

router.post("/login", (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    res.send('Wrong password! <a href="/admin/login">Try again</a>');
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

export default router;
