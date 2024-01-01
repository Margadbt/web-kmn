const express = require("express");
const router = express.Router();
const login = require("../../login");
const cookieParser = require("cookie-parser");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

router.use(cookieParser());
router.use(express.json());

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

router.post("/register", (req, res) => {
  const { username, email, password, mbtiResult } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Invalid registration data" });
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    pool.query(
      `INSERT INTO "user" (username, email, password, mtbiResult) VALUES ($1, $2, $3, $4) RETURNING user_id`,
      [username, email, hashedPassword, mbtiResult],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        const user_id = result.rows[0].user_id;

        const session_id = login.createSession(user_id, username, email);

        res.cookie("session_id", session_id, { httpOnly: true });

        res.status(201).json({ user_id });
      }
    );
  });
});

router.get("/logout", (req, res) => {
  const sessionId = req.cookies.session_id;
  login.logout(sessionId);
  res.clearCookie("session_id");
  res.status(200);
  res.redirect("/login");
});

module.exports = router;
