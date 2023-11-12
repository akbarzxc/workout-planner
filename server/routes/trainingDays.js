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


//AKBAR: 
//GET http://localhost:3001/training-days/:training_day_id/workout-events
//Fetch the workout events for this training day


module.exports = router;