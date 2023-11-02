const express = require('express')
const router = express.Router()
const db = require('../db')


/* Logic for endpoint POST http://localhost:3001/workoutplan/getcycle
Workout_events is an array consisting of workout events. Empty if there are no workout events
        {
            "cycle_id": ...,
            "user_id": ...,
            "name": ..., 
            "workout_events": [
                { 
                    "event_id": "3"
                    "name": 'Back day'
                    "is_rest_day": "false"
                    "order_in_cycle": "1"
                },
                {
                    "event_id": "25"
                    "name": "Rest day"
                    "is_rest_day": "true"
                    "order_in_cycle": "2"
                }
                ....
            ]
        }
        */

router.post('/getcycle', async (req, res) => {
  const { userID } = req.body;
  if(!userID) return res.status(400).json({ error: 'userID missing' });
  try {
        const { rows } = await db.query('SELECT * FROM workout_cycle WHERE user_id = $1', [userID]);
        let workoutCycle = rows[0];
        let workoutEvents = [];
        //No workout cycle exists for user so create one 
        if(!workoutCycle) 
        {
            const insertResult = await db.query('INSERT INTO workout_cycle (user_id) VALUES ($1) RETURNING *', [userID]);
            workoutCycle = insertResult.rows[0];
            console.log('Created new workout cycle for user');
            res.status(201).json({
                ...workoutCycle, 
                workout_events: workoutEvents
            });
        } else {
            console.log('Fetching existing workout cycle and workout events for user')
            const workoutEventsResult = await db.query('SELECT * FROM workout_event WHERE cycle_id = $1', [workoutCycle.cycle_id]);
            workoutEvents = workoutEventsResult.rows;
    
            res.status(200).json({
                ...workoutCycle,
                workout_events: workoutEvents
            });
        }
  } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
  }
});




module.exports = router