const express = require("express");
const router = express.Router();
const login = require("../../login");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://default:pKvlL1OiN8Ac@ep-nameless-glade-19285305-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

router.post("/result", (req, res) => {
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

module.exports = router;
