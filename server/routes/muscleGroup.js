const express = require('express')
const router = express.Router()
const db = require('../db')


router.get('/', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM muscle_group');
      res.send(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
  }
});

module.exports = router