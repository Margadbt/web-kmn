/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_id
 *         - username
 *         - password
 *         - email
 *       properties:
 *         user_id:
 *           type: integer
 *           description: Хэрэглэгчийн ID
 *         username:
 *           type: string
 *           description: Хэрэглэгчийн нэр
 *         email:
 *           type: string
 *           description: Хэрэглэгчийн email
 *         password:
 *           type: string
 *           description: Хэрэглэгчийн нууц үг
 *         mbti_result:
 *           type: string
 *           description: MBTI Тестийн үр дүн
 *
 * 
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Community хэсгийн post зохицуулах API
 * /user:
 *   get:
 *     summary: Хэрэглэгчийн мэдээллийг буцаах.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Амжилттай хэрэглэгчийн мэдээллийг буцаасан.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Хэрэглэгч
 * /user/register:
 *  post:
 *    summary: Хэрэглэгч үүсгэх
 *    tags: [User]
 *    parameters:
 *      - in: username
 *        name: username
 *        schema:
 *          type: string
 *        required: true
 *        description: Хэрэглэгчийн нэр
 *      - in: email
 *        name: email
 *        schema:
 *           type: string
 *        required: true
 *        description: Хэрэглэгчийн email
 *      - in: password
 *        name: password
 *        schema:
 *          type: string
 *        required: true
 *        description: Хэрэглэгчийн нууц үг
 *    responses:
 *      201:
 *        description: Нэвтэрсэн
 *        contens:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *      500:
 *        description: Internal Server Error
 * /user/login:
 *   post:
 *     summary: Хэрэглэгч нэвтрэх
 *     tags: [User]
 *     parameters:
 *       - in: email
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Хэрэглэгчийн email
 *       - in: password
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Хэрэглэгчийн нууц үг
 *     responses:
 *       200:
 *         description: Login successful
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal Server Error
 * /api/mbti/result/change:
 *    post:
 *      summary: MBTI Тест хариу хадгалах
 *      tags: [User]
 *      parameters:
 *      - in: mbti_result
 *        name: mbti_result
 *        schema:
 *          type: string
 *        required: true
 *        description: MBTI үр дүн
 *      - in: user_id
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Хэрэглэгчийн ID
 *      responses:
 *        201:
 *          description: Sucessfully saved
 *        500:
 *          description: Internal Server Error
 */

const express = require("express");
const router = express.Router();
const login = require("../../login");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

router.use(cookieParser());
router.use(express.json());

router.get("/", (req, res) => {
  if (!login.sessions.has(Number(req.cookies.session_id))) {
    res.status(401).send("Forbidden");
    return;
  }
  const userInfo = {
    fullname: login.sessions.get(Number(req.cookies.session_id)).fullname,
    email: login.sessions.get(Number(req.cookies.session_id)).user,
    user_id: login.sessions.get(Number(req.cookies.session_id)).user_id,
    mbti_result: login.sessions.get(Number(req.cookies.session_id)).mbti_result,
  };
  res.status(200);
  res.json(userInfo);
});

router.post("/register", (req, res) => {
  const { username, email, password, mbti_result } = req.body;

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
      `INSERT INTO "user" (username, email, password, mbti_result) VALUES ($1, $2, $3, $4) RETURNING user_id`,
      [username, email, hashedPassword, mbti_result],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        const user_id = result.rows[0].user_id;

        // const session_id = login.createSession(user_id, username, email);

        // res.cookie("session_id", session_id, { httpOnly: true });

        res.status(201).json({ user_id });
      }
    );
  });
});

router.get("/all", (req, res) => {
  pool.query(`SELECT * from "user"`, (err, result) => {
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM user WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  const sessionId = req.cookies.session_id;
  login.logout(sessionId);
  res.clearCookie("session_id");
  res.status(200);
  res.redirect("/login");
});

module.exports = router;
