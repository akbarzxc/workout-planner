const express = require('express')
const router = express.Router()
const db = require('../db')


router.get('/', (req, res) => {
  db.any("SELECT * FROM muscle_group;")
  .then(rows => {
    res.json(rows)
  })
  .catch(error => {
    console.log(error)
  })
})

module.exports = router