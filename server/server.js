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
const usersRouter = require('./routes/users')
const muscleGroupsRouter = require('./routes/muscleGroups');
const workoutCyclesRouter = require('./routes/workoutCycles');
const workoutEventsRouter = require('./routes/workoutEvents')
const trainingDaysRouter = require('./routes/trainingDays')
const movementsRouter = require('./routes/movements')
const workoutMovementsRouter = require('./routes/workoutMovements')
const selectedMuscleGroupsRouter = require('./routes/selectedMuscleGroups')

//Endpoints
app.use('/users', usersRouter)
app.use('/training-days', trainingDaysRouter)
app.use('/workout-events', workoutEventsRouter)
app.use('/workout-cycles', workoutCyclesRouter)
app.use('/musclegroups', muscleGroupsRouter)
app.use('/movements', movementsRouter)
app.use('/workout-movements', workoutMovementsRouter)
app.use('/selected-muscle-groups', selectedMuscleGroupsRouter)



app.listen(port, () => console.log(`App listening on port ${port}`))