const express = require("express");
const router = express.Router();
const login = require("../../login");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

router.post("/result/change", (req, res) => {
  const { mbti_result, user_id } = req.body;

  pool.query(
    'UPDATE "user" SET mbti_result=$1 WHERE user_id=$2',
    [mbti_result, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(201).json(result.rows[0]);
    }
  );
});

module.exports = router;
