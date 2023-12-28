const express = require("express");
const router = express.Router();
const login = require("../../login");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  console.log(login.sessions.has(Number(req.cookies.session_id)));

  if (!login.sessions.has(Number(req.cookies.session_id))) {
    res.status(401).send("Forbidden");
    return;
  }
  const userInfo = {
    fullname: login.sessions.get(Number(req.cookies.session_id)).fullname,
    email: login.sessions.get(Number(req.cookies.session_id)).user,
    user_id: login.sessions.get(Number(req.cookies.session_id)).user_id,
  };
  res.status(200);
  res.json(userInfo);
});

router.get("/logout", (req, res) => {
  const sessionId = req.cookies.session_id;
  login.logout(sessionId);
  res.clearCookie("session_id");
  res.status(200);
  res.redirect("/login");
});

module.exports = router;
