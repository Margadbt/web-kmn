const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

class Login {
  constructor() {
    this.sessions = new Map();
    this.users = new Map();
  }

  async verifyLogin(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [
        email,
      ]);

      if (result.rows.length === 0) {
        res.status(403).json({ error: "Invalid email or password" });
        return;
      }

      const user = result.rows[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(403).json({ error: "Invalid email or password" });
        return;
      }

      const sid = Math.floor(Math.random() * 100_000_000_000_000);
      this.sessions.set(sid, {
        user: email,
        user_id: user.user_id,
        fullname: user.username,
        mbti_result: user.mbti_result,
        logged: Date.now(),
      });

      // sessionStorage.setItem("user_id", user.user_id);

      res.cookie("session_id", sid);
      res.status(200).json({
        result: "OK",
        username: user.fullname,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  logout(sessionId) {
    this.sessions.delete(sessionId);
    console.log(`Session ${sessionId} logged out`);
    sessionStorage.clear();
    window.location.href = "/";
  }

  registerUser(username, email, password) {
    const user_id = Math.floor(Math.random() * 100_000);
    console.log("Got them usersss");
    this.users.set(email, {
      user_id: user_id,
      password: password,
      fullname: username,
    });
    console.log("Assigned them users");

    // console.log(this.users.values);

    console.log(`User ${email} registered`);
  }
}

const login = new Login();

module.exports = login;
