const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 4000;

app.use(express.json());

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

client.connect();

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/test", (req, res) => {
  res.sendFile("public/pages/test.html", { root: __dirname });
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
  client.query(`SELECT * FROM groups`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
});
//READ
app.get("/api/posts", (req, res) => {
  client.query(`Select * from posts ORDER BY postid DESC;`, (err, result) => {
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  });
});
//SINGLE POST READ
app.get("/api/posts/:id", (req, res) => {
  client.query(
    `select * from posts where groupid=${req.params.id} ORDER BY postid DESC;`,
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
  client.query(
    `INSERT INTO posts (userid, groupid, description, likecount, photourl, commentcount)
    VALUES ('${req.body.userid}', '${req.body.groupid}', '${req.body.description}',
    '${req.body.likecount}', '${req.body.photo}', '${req.body.commentcount}' )`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).json(result.rows[0]);
    }
  );
});
//UPDATE
app.delete("/api/posts/delete/:id", (req, res) => {
  const postId = req.params.id;

  client.query(`DELETE FROM posts WHERE postid=${postId}`, (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).send('Internal Server Error');
      return;
    }



    // if (result.rows.length === 0) {
    //   res.status(404).send('Post олдсонгүй');
    //   return;
    // }
    res.status(200).send("Ustlaa")
    res.json(result.rows[0]);
  });
});

app.listen(port, () => {
  console.log("server listening on ", port);
});
