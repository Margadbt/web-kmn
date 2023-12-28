const express = require("express");
const router = express.Router();
const path = require("path");
const cookieParser = require("cookie-parser");
const login = require("../login.js");

router.use("/public", express.static("public"));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/test.html"));
});

router.get("/login", (req, res) => {
  if (login.sessions.has(Number(req.cookies.session_id))) {
    res.redirect('/');
    return;
  }
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/register.html"));
});

router.get("/community", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/community.html"));
});

router.get("/plan", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/plan.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/profile.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/register.html"));
});

module.exports = router;
