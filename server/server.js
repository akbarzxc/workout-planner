require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const morgan = require('./middleware/morganMiddleware')

//Middleware and authentication
app.use(cors())
app.use(express.json())
app.use(morgan)
app.use(ClerkExpressRequireAuth());

//Routers
const muscleGroupRouter = require('./routes/muscleGroup');
const workoutPlanningRouter = require('./routes/workoutPlanning');

//Endpoints
app.use('/musclegroups', muscleGroupRouter)
app.use('/workoutplan', workoutPlanningRouter)

app.listen(port, () => console.log(`App listening on port ${port}`))