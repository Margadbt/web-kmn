class Login {
  constructor() {
    this.sessions = new Map();
    this.users = new Map();
  }

  verifyLogin(req, res) {
    const email = req.body.email;
    const pass = req.body.password;

    if (!this.users.has(email) || this.users.get(email).password !== pass) {
      res.status(403).end();
      return;
    }

    const sid = Math.floor(Math.random() * 100_000_000_000_000);
    this.sessions.set(sid, {
      user: email,
      user_id: this.users.get(email).user_id,
      fullname: this.users.get(email).fullname,
      logged: Date.now(),
    });
    console.log(this.sessions);

    res.status(200);
    res.cookie("session_id", sid);
    res.send({
      result: "OK",
      username: this.users.get(email).fullname,
    });
    res.redirect("/");
  }

  logout(sessionId) {
    this.sessions.delete(sessionId);
    console.log(`Session ${sessionId} logged out`);
  }

  registerUser(username, email, password) {
    const user_id = Math.floor(Math.random() * 100_000);

    this.users.set(email, {
      user_id: user_id,
      password: password,
      fullname: fullname,
    });

    console.log(this.users.values);

    console.log(`User ${email} registered`);
  }
}

const login = new Login();

module.exports = login;
