const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
require('dotenv').config();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

app.use(cors())
const morgan = require('./middleware/morganMiddleware')
app.use(morgan)
app.use(ClerkExpressRequireAuth());

const testRouter = require('./routes/test')
const muscleGroupRouter = require('./routes/muscleGroup');

app.use('/test', testRouter)
app.use ('/musclegroups', muscleGroupRouter)

app.listen(port, () => console.log(`App listening on port ${port}`))