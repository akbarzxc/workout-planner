const express = require('express');
const router = express.Router();
const db = require('../db');

//GET http://localhost:3001/workout-cycles/:cycle_id
//Fetching lots of data for workout plan view: the cycle details,
//training days, workout events and summary of worked muscle groups per event
router.get('/:cycle_id', async (req, res) => {
  const { cycle_id } = req.params;

  try {
    const { rows: WorkoutCycles } = await db.query('SELECT * FROM workout_cycle WHERE cycle_id = $1', [cycle_id]);
    let workoutCycle = WorkoutCycles[0];
    let workoutDays = [];
    let statusCode = 200;

    const trainingDaysResult = await db.query('SELECT * FROM training_day WHERE cycle_id = $1 ORDER BY training_day_id', [workoutCycle.cycle_id]);
    workoutDays = trainingDaysResult.rows;

    for (const day of workoutDays) {
      const eventsResult = await db.query('SELECT * FROM workout_event WHERE training_day_id = $1 ORDER BY event_id', [day.training_day_id]);
      day.workout_events = eventsResult.rows;

      for (const event of day.workout_events) {
        const muscleGroupsResult = await db.query(`
            SELECT DISTINCT
              muscle_group.muscle_group_id,
              muscle_group.name
            FROM
              workout_event
            JOIN
              movement_trained_in_workout
              ON workout_event.event_id = movement_trained_in_workout.event_id
            JOIN
              movements
              ON movement_trained_in_workout.movement_id = movements.movement_id
            JOIN
              workout_affects_muscle
              ON movements.movement_id = workout_affects_muscle.movement_id
            JOIN
              muscle_group
              ON workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
            WHERE
              workout_event.event_id = $1
          `, [event.event_id]);

        event.muscle_groups = muscleGroupsResult.rows;
      }
    }
    
    res.status(statusCode).json({
      ...workoutCycle,
      workout_days: workoutDays
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//PUT http://localhost:3001/workout-cycles/:cycle_id
//to update the name of a user's workout cycle. Nothing else can be updated
router.put('/:cycle_id', async (req, res) => {
    const { cycle_id } = req.params;
    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }

      try {
        const { rows } = await db.query(`UPDATE workout_cycle SET name = $1 WHERE cycle_id = $2 RETURNING *;`, [name.trim(), cycle_id]);
    
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Workout cycle not found for the given cycle_id' });
        }
    
        res.status(200).json(rows[0]);

      } catch (err) {
        console.error('Error updating workout_cycle:', err);
        res.status(500).send('Internal Server Error');
      }
    });

module.exports = router;
