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
const userRouter = require('./routes/user')
const muscleGroupRouter = require('./routes/muscleGroup');
const workoutCycleRouter = require('./routes/workoutCycles');
const workouteventRouter = require('./routes/workoutEvents')
const trainingdayRouter = require('./routes/trainingDays')

//Endpoints
app.use('/users', userRouter)
app.use('/training-days', trainingdayRouter)
app.use('/workout-events', workouteventRouter)
app.use('/workout-cycles', workoutCycleRouter)
app.use('/musclegroups', muscleGroupRouter)



app.listen(port, () => console.log(`App listening on port ${port}`))