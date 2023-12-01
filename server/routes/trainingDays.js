const express = require('express');
const router = express.Router();
const db = require('../db');


//PUT http://localhost:3001/training-days/:training_day_id
//For toggling a training day to rest or not
router.put('/:training_day_id', async (req, res) => {
  const { training_day_id } = req.params;
  const { is_rest_day } = req.body;

  if (training_day_id === undefined || is_rest_day === undefined) {
    return res.status(400).json({ error: 'training_day_id and is_rest_day are required' });
  }

  if (typeof is_rest_day !== 'boolean') {
    return res.status(400).json({ error: 'is_rest_day must be a boolean value' });
  }

  try {

    const { rows } = await db.query(`UPDATE training_day SET is_rest_day = $1 WHERE training_day_id = $2 RETURNING *;`, [is_rest_day, training_day_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'training_day_id not found' });
    }

    res.status(200).json(rows[0]);

  } catch (err) {
    console.error('Error updating training_day:', err);
    res.status(500).send('Internal Server Error');
  }
});

//POST http://localhost:3001/training-days/:training_day_id/workout-events
//create a new workout_event for workout_day. Create the logic for ordering in frontend how you wish
router.post('/:training_day_id/workout-events', async (req, res) => {
  const { training_day_id } = req.params;
  const { name, order_in_day } = req.body;

  if (!training_day_id || !order_in_day) {
    return res.status(400).json({ error: 'training_day_id and/or order_in_day is required' });
  }

  try {
    const trainingDayCheck = await db.query('SELECT * FROM training_day WHERE training_day_id = $1', [training_day_id]);
    if (trainingDayCheck.rows.length === 0) {
      return res.status(404).json({ error: 'training_day_id not in database' });
    }
    const { rows } = await db.query(`INSERT INTO workout_event (name, training_day_id, order_in_day) VALUES ($1, $2, $3) RETURNING *;`, [name || 'My Workout', training_day_id, order_in_day]);
    const newWorkoutEvent = rows[0];
    res.status(201).json(newWorkoutEvent);

  } catch (err) {
    console.error('Error creating new workout_event:', err);
    res.status(500).send('Internal Server Error');
  }
});


// GET http://localhost:3001/training-days/:day_number
// Fetch the workout events for a specific day of the week within a workout cycle


router.get('/training-days/:day_number', async (req, res) => {
  const { day_number } = req.params;

  // Convert day_number to an integer. Expecting 1 (Monday) to 7 (Sunday)
  const order_in_cycle = parseInt(day_number);

  if (isNaN(order_in_cycle) || order_in_cycle < 1 || order_in_cycle > 7) {
    return res.status(400).json({ error: 'Invalid day_number' });
  }

  try {
    // Fetch the first (or only) workout cycle ID
    const cycleResult = await db.query('SELECT cycle_id FROM workout_cycle LIMIT 1');
    const cycleId = cycleResult.rows[0]?.cycle_id;

    if (!cycleId) {
      return res.status(404).json({ error: 'No workout cycle found' });
    }

    // Fetch the training day based on the order_in_cycle
    const trainingDaysResult = await db.query(`
      SELECT * FROM training_day 
      WHERE cycle_id = $1 AND order_in_cycle = $2
    `, [cycleId, order_in_cycle]);

    const trainingDay = trainingDaysResult.rows[0];

    if (!trainingDay) {
      return res.status(404).json({ error: 'No training day found for the given day_number' });
    }

    // Fetch workout events for the training day
    const eventsResult = await db.query(`
      SELECT * FROM workout_event 
      WHERE training_day_id = $1 
      ORDER BY order_in_day
    `, [trainingDay.training_day_id]);

    const workoutEvents = eventsResult.rows;

    for (const event of workoutEvents) {
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

      const movementsResult = await db.query(`
        SELECT 
          movement_trained_in_workout.*, 
          movements.name AS movement_name,
          workout_affects_muscle.muscle_group_id, 
          muscle_group.name AS muscle_group_name
        FROM 
          movement_trained_in_workout
        JOIN 
          movements ON movement_trained_in_workout.movement_id = movements.movement_id
        JOIN 
          workout_affects_muscle ON movements.movement_id = workout_affects_muscle.movement_id
        JOIN
          muscle_group ON workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
        WHERE 
          movement_trained_in_workout.event_id = $1
      `, [event.event_id]);

      event.movements = movementsResult.rows;
    }

    res.status(200).json({
      ...trainingDay,
      workout_events: workoutEvents
    });
  } catch (err) {
    console.error('Error fetching workout events for the day:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;