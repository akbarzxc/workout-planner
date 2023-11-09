const express = require('express')
const router = express.Router()
const db = require('../db')


//PUT cycle

//Logic for endpoint POST http://localhost:3001/workoutplan/cycle

router.post('/cycle', async (req, res) => {
  const { userID } = req.body;
  if(!userID) return res.status(400).json({ error: 'userID missing' });

  try {
        const { rows: WorkoutCycles } = await db.query('SELECT * FROM workout_cycle WHERE user_id = $1', [userID]);
        let workoutCycle = WorkoutCycles[0];
        let workoutDays = [];
        let statusCode = 200;
        
        if(!workoutCycle) 
        {
            console.log(`Creating new cycle to user ${userID}`)

            //Step 1: Create the workout cycle
            const insertedCycle = await db.query('INSERT INTO workout_cycle (user_id) VALUES ($1) RETURNING *', [userID]);
            workoutCycle = insertedCycle.rows[0];
            const newCycleId = workoutCycle.cycle_id;

            //Step 2: Create 7 training days and assign as rest days
            for (let i = 1; i <= 7; i++) {            
                const insertedTrainingDay = await db.query('INSERT INTO training_day (is_rest_day, order_in_cycle, cycle_id) VALUES ($1, $2, $3) RETURNING *', [true, i, newCycleId]);
                const trainingDay = insertedTrainingDay.rows[0];
                trainingDay.workout_events = [];
                workoutDays.push(trainingDay)
            }
            

            statusCode = 201;
        } 
        else 
        {
            console.log(`Fetching existing workout cycle and workout events for user ${userID} `)
            const trainingDaysResult = await db.query('SELECT * FROM training_day WHERE cycle_id = $1', [workoutCycle.cycle_id]);
            workoutDays = trainingDaysResult.rows;

            for(const day of workoutDays){
                const events = await db.query('SELECT * FROM workout_event WHERE training_day_id = $1', [day.training_day_id]);
                day.workout_events = events.rows;

                for (const event of day.workout_events) {
                    const muscleGroupsResult = await db.query(`
                        SELECT DISTINCT
                            muscle_group.muscle_group_id,
                            muscle_group.name
                        FROM
                            workout_event
                        JOIN
                            movement_trained_in_workout
                        ON
                            workout_event.event_id = movement_trained_in_workout.event_id
                        JOIN
                            movements
                        ON
                            movement_trained_in_workout.movement_id = movements.movement_id
                        JOIN
                            workout_affects_muscle
                        ON
                            movements.movement_id = workout_affects_muscle.movement_id
                        JOIN
                            muscle_group
                        ON
                            workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
                        WHERE
                            workout_event.event_id = $1
                    `, [event.event_id]);
        
                    event.muscle_groups = muscleGroupsResult.rows;
                }
            }
        }
    
        res.status(statusCode).json({
            ...workoutCycle,
            workout_days: workoutDays
        });
        
  } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
  }
});

module.exports = router