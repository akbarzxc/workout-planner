const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())
const morgan = require('./middleware/morganMiddleware')
app.use(morgan)

const testRouter = require('./routes/test')
const muscleGroupRouter = require('./routes/muscleGroup')

app.use('/test', testRouter)
app.use ('/musclegroups', muscleGroupRouter)

app.listen(port, () => console.log(`App listening on port ${port}`))