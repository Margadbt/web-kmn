/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - post_id
 *         - description
 *         - user_id
 *         - group_id
 *         - username
 *       properties:
 *         post_id:
 *           type: integer
 *           description: ID нь шинэ пост үүсэх тутамд автоматаар нэмэгдэнэ
 *         user_id:
 *           type: integer
 *           description: Post бичсэн хэрэглэгчийн ID
 *         group_id:
 *           type: integer
 *           description: Post хамаарах группийн ID
 *         description:
 *           type: string
 *           description: Post хэсгийн тайлбар
 *         username:
 *           type: string
 *           description: User-ын username
 *         like_count:
 *           type: integer
 *           description: Post-ны Like тоо
 *         comment_count:
 *           type: integer
 *           description: Comment-ын тоо
 *
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Community хэсгийн post зохицуулах API
 * /api/community/posts:
 *   get:
 *     summary: Бүх постуудыг буцаах.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Бүх постуудын жагсаалт
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *   post:
 *     summary: Шинэ post үүсгэх
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       500:
 *         description: Internal Server Error.
 * /api/community/post/group/{id}:
 *  get:
 *    summary: Group ID аар нь постуудын шүүж авах.
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Post-ын ID
 *      - in: group_id
 *        name: group_id
 *        schema:
 *           type: integer
 *        required: true
 *        description: Тухайн группын ID.
 *    responses:
 *      200:
 *        description: OK
 *        contens:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *      404:
 *        description: Not found
 * /api/community/post/{id}:
 *   get:
 *     summary: ID-аар нь post-ыг авах.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post-ын ID
 *     responses:
 *       200:
 *         description: Хариу.
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       404:
 *         description: Not found.
 *   delete:
 *     summary: Id-аар нь пост устгах.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: Post deleted sucessfully.
 *       404:
 *         description: Post not found.
 */



const express = require('express');
const router = express.Router();
const login = require('../../login');
const { Pool } = require("pg");
const { route } = require('./userRoutes');

const pool = new Pool({
  connectionString: "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
})

router.get("/groups", (req, res) => {
  pool.query(`SELECT * FROM groups`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
});
router.get("/group/:id", (req, res) => {
  pool.query(`SELECT * FROM groups where group_id=${req.params.id}`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
});
//READ
router.get("/posts", (req, res) => {
  pool.query(`Select * from posts ORDER BY post_id DESC;`, (err, result) => {
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  });
});
//SINGLE POST READ
router.get("/posts/group/:id", (req, res) => {
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
//SINGLE POST READ
router.get("/post/:id", (req, res) => {
  pool.query(
    `select * from posts where post_id=${req.params.id} ORDER BY post_id DESC;`,
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
router.post("/post/create", (req, res) => {
  pool.query(
    `INSERT INTO posts (user_id, group_id, group_name, description, username, comment_count, like_count )
    VALUES ('${req.body.user_id}', '${req.body.group_id}', '${req.body.group_name}', '${req.body.description}',
    '${req.body.username}', '${req.body.comment_count}', '${req.body.like_count}' )`,
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
//DELETE POST
router.delete("/post/delete/:id", (req, res) => {
  const postId = req.params.id;

  pool.query(`DELETE FROM posts WHERE post_id=${postId}`, (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // if (result.rows.length === 0) {
    //   res.status(404).send('Post олдсонгүй');
    //   return;
    // }
    res.status(200).send("Post Deleted Succesfully.")
    res.json(result.rows[0]);
  });
});
//ALL COMMENTS
router.get("/comments/:id", (req, res)=>{
  const postId = req.params.id;

  pool.query(`Select * from comments where post_id=${postId} ORDER BY date DESC`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
})
//CREATE COMMENT
router.post("/post/comment/create/:id", (req, res)=>{
  const postId = req.params.id;

  pool.query(`INSERT INTO comments (post_id, user_id, username, description, date) VALUES (${req.body.post_id}, ${req.body.user_id}, '${req.body.username}', '${req.body.description}', '${req.body.date}') `, (err, result)=>{
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).json(result.rows[0]);
  })
})

//Delete Comments

//Update comment count of post
router.post("/post/comment/update/:id", (req, res)=>{
  const postId = req.params.id;

  pool.query(`UPDATE posts SET comment_count = '${req.body.comment_count}' WHERE post_id = ${postId}`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
})

//Count number of comments
router.get("/post/comment/count/:id", (req,res)=>{
  const postId = req.params.id;

  pool.query(`select count(*) from comments where post_id = ${postId}`, (err, result)=>{
    if (err) {
      res.status(500).send("Internal server Error");
      return;
    }
    res.json(result.rows);
  })
})
//
router.post("/post/like/:id", (req, res)=>{
  const postId = req.params.id;

  pool.query(`INSERT INTO likes (user_id, post_id, username, date) VALUES(${req.body.user_id}, ${postId}, '${req.body.username}', '${req.body.date}')`, (err, result)=>{
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).json(result.rows[0]);
  })
})

router.get("/post/like/:id", (req, res)=>{
  const postId = req.params.id;

  pool.query(`SELECT * FROM likes where post_id=${postId}`, (err, result)=>{
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).json(result.rows[0]);
  })
})

module.exports = router;
