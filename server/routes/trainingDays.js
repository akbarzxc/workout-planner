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


// GET http://localhost:3001/training-days/:training_day_id/workout-events
// Fetch the workout events for a specific training day
// Example from pre-populated data
/**
 * [
{
"event_id": 183,
"name": "Upper workout",
"training_day_id": 41,
"order_in_day": 1,
"muscle_groups": [
{
"muscle_group_id": 3,
"name": "Biceps"
},
{
"muscle_group_id": 4,
"name": "Triceps"
},
{
"muscle_group_id": 2,
"name": "Chest"
},
{
"muscle_group_id": 1,
"name": "Back"
},
{
"muscle_group_id": 5,
"name": "Shoulders"
},
{
"muscle_group_id": 8,
"name": "Forearms"
}
],
"movements": [
{
"relation_id": 270,
"event_id": 183,
"sets": 3,
"reps": 12,
"movement_id": 1,
"movement_name": "Pullup"
},
{
"relation_id": 268,
"event_id": 183,
"sets": 5,
"reps": 5,
"movement_id": 4,
"movement_name": "Overhead Press"
},
{
"relation_id": 273,
"event_id": 183,
"sets": 3,
"reps": 10,
"movement_id": 6,
"movement_name": "Biceps curl"
},
{
"relation_id": 274,
"event_id": 183,
"sets": 3,
"reps": 10,
"movement_id": 8,
"movement_name": "Triceps Extension"
},
{
"relation_id": 271,
"event_id": 183,
"sets": 2,
"reps": 10,
"movement_id": 12,
"movement_name": "T-bar Row"
},
{
"relation_id": 272,
"event_id": 183,
"sets": 2,
"reps": 10,
"movement_id": 17,
"movement_name": "Forearm extension"
},
{
"relation_id": 269,
"event_id": 183,
"sets": 3,
"reps": 12,
"movement_id": 14,
"movement_name": "Incline Bench Press"
}
]
}
]
 */

router.get('/:training_day_id/workout-events', async (req, res) => {
  const { training_day_id } = req.params;

  try {
    // Fetch workout events for the training day, ordered by order_in_day
    const eventsResult = await db.query(`
      SELECT * FROM workout_event 
      WHERE training_day_id = $1 
      ORDER BY order_in_day
    `, [training_day_id]);
    const workoutEvents = eventsResult.rows;

    for (const event of workoutEvents) {
      // Query to get muscle groups
      const muscleGroupsResult = await db.query(`
        SELECT DISTINCT
          muscle_group.muscle_group_id,
          muscle_group.name
        FROM
          workout_event
        JOIN
          movement_trained_in_workout ON workout_event.event_id = movement_trained_in_workout.event_id
        JOIN
          movements ON movement_trained_in_workout.movement_id = movements.movement_id
        JOIN
          workout_affects_muscle ON movements.movement_id = workout_affects_muscle.movement_id
        JOIN
          muscle_group ON workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
        WHERE
          workout_event.event_id = $1
      `, [event.event_id]);
      event.muscle_groups = muscleGroupsResult.rows;

      // Query to get movements
      const movementsResult = await db.query(`
        SELECT 
          movement_trained_in_workout.*, 
          movements.name AS movement_name
        FROM 
          movement_trained_in_workout
        JOIN 
          movements ON movement_trained_in_workout.movement_id = movements.movement_id
        WHERE 
          movement_trained_in_workout.event_id = $1
      `, [event.event_id]);
      event.movements = movementsResult.rows.map(movement => ({
        ...movement,
      }));
    }

    res.status(200).json(workoutEvents);
  } catch (err) {
    console.error('Error fetching workout events:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

