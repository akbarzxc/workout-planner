const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Users!')
})

router
  .route("/:id")
  .get((req, res) => {
    res.send(`Welcome user ${req.id}`)
  })
  .post((req, res) => {
    res.send(`Creating new user ${req.id}`)
  })
  .put((req, res) => {
    res.send(`Updating user ${req.id}`)
  })
  .delete((req, res) => {
    res.send(`Deleting user ${req.id}`)
  })


  router.param('id', (req, res, next, id) => {
    req.id = id
    next()
  })

module.exports = router