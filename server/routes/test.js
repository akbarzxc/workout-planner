const express = require('express')
const router = express.Router()

const users = [
  {id: '1', name: 'Veeti'},
  {id: '2', name: 'Markus'},
  {id:'3', name: 'Akbar'}
]

router.get('/', (req, res) => {
  res.json(users)
})

router.get('/more', (req, res) => {
  res.send('This works too!')
})


module.exports = router