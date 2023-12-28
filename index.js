const express = require("express");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const login = require("./login.js");

const app = express();
const port = 4000;

app.use(express.json());

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "postgres",
//   port: 5432,
// });

// pool.connect();

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

login.users.set("margad@mail.com", {
  user_id: 1,
  fullname: "Margad",
  password: "123",
});
login.users.set("khanka@mail.com", {
  user_id: 2,
  fullname: "Khanka",
  password: "123",
});
login.users.set("nomio@mail.com", {
  user_id: 3,
  fullname: "Nomio",
  password: "123",
});

app.use(cookieParser());
app.post("/login", (req, res) => {
  login.verifyLogin(req, res);
});

app.use("/public", express.static("public"));

app.get("/api/user", (req, res) => {
  console.log(login.sessions.has(Number(req.cookies.session_id)));
  // if (!login.sessions.has(Number(req.cookies.session_id)))
  // {
  //     res.status(401).send("Forbidden");
  //     return;
  // }

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

app.get("/logout", (req, res) => {
  const sessionId = req.cookies.session_id;
  login.logout(sessionId);
  res.clearCookie("session_id");
  res.status(200);
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/test", (req, res) => {
  res.sendFile("public/pages/test.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  if (login.sessions.has(Number(req.cookies.session_id))) {
    res.redirect("/");
    return;
  }
  res.sendFile("public/pages/login.html", { root: __dirname });
});

app.get("/register", (req, res) => {
  res.sendFile("public/pages/register.html", { root: __dirname });
});

app.get("/community", (req, res) => {
  res.sendFile("public/pages/community.html", { root: __dirname });
});

app.get("/plan", (req, res) => {
  res.sendFile("public/pages/plan.html", { root: __dirname });
});

app.get("/profile", (req, res) => {
  res.sendFile("public/pages/profile.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("public/pages/login.html", { root: __dirname });
});

app.get("/register", (req, res) => {
  res.sendFile("public/pages/register.html", { root: __dirname });
});

//api
app.get("/api/groups", (req, res) => {
  pool.query(`SELECT * FROM groups`, (err, result) => {
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  });
});
//READ
app.get("/api/posts", (req, res) => {
  pool.query(`Select * from posts ORDER BY post_id DESC;`, (err, result) => {
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  });
});
//SINGLE POST READ
app.get("/api/posts/:id", (req, res) => {
  pool.query(
    `select * from posts where group_id=${req.params.id} ORDER BY post_id DESC;`,
    (err, result) => {
      if (err) {
        res.status(500).send("Internal server Error");
        return;
      }
      res.json(result.rows);
    }
  );
});
//CREATE
app.post("/api/posts/create", (req, res) => {
  pool.query(
    `INSERT INTO posts (user_id, group_id, description, like_count, photo_url, comment_count)
    VALUES ('${req.body.user_id}', '${req.body.group_id}', '${req.body.description}',
    '${req.body.like_count}', '${req.body.photo}', '${req.body.comment_count}' )`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(201).json(result.rows[0]);
    }
  );
});
//DELETE POST
app.delete("/api/posts/delete/:id", (req, res) => {
  const postId = req.params.id;

  pool.query(`DELETE FROM posts WHERE post_id=${postId}`, (err, result) => {
    if (err) {
      console.error("Error deleting post:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    // if (result.rows.length === 0) {
    //   res.status(404).send('Post олдсонгүй');
    //   return;
    // }
    res.status(200).send("Ustlaa");
    res.json(result.rows[0]);
  });
});
// Send MBTI Results
app.post("/api/mbti/result", (req, res) => {
  pool.query(
    `INSERT INTO mbtiresult (result) VALUES ('${req.body.result}')`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(201).json(result.rows[0]);
    }
  );
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`);
});
