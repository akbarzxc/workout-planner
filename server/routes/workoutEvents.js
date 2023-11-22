const express = require('express');
const router = express.Router();
const db = require('../db')

//WorkoutEvents Resource

  //PUT http://localhost:3001/workout-events/:event_id
  //update the name and order of workout inside a training day
  //create the logic for which order number you change this to inside frontend!
  router.put('/:event_id', async (req, res) => {
    const { event_id } = req.params;
    const { name, order_in_day } = req.body;
  
    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }
  
    try {  
      const { rows } = await db.query(`
      UPDATE workout_event 
      SET name = COALESCE($1, name), order_in_day = COALESCE($2, order_in_day)
      WHERE event_id = $3
      RETURNING *;`, [name, order_in_day, event_id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Workout event not found' });
      }
      const updatedWorkoutEvent = rows[0];
  
      res.status(200).json(updatedWorkoutEvent);
    } catch (err) {
      console.error('Error updating workout_event:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  //DELETE http://localhost:3001/workout-events/:event_id
  //To remove a certain event
  router.delete('/:event_id', async (req, res) => {
    const { event_id } = req.params;
  
    try {
      await db.query(`DELETE FROM movement_trained_in_workout WHERE event_id = $1;`, [event_id]);

      const { rows } = await db.query(`DELETE FROM workout_event WHERE event_id = $1  RETURNING *;`, [event_id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Workout event not found' });
      }

      res.status(200).json({
        message: 'Workout event successfully deleted',
        deletedWorkoutEvent: rows[0]
      });
    } catch (err) {
      console.error('Error deleting workout_event:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  //GET http://localhost:3001/workout-events/:event_id/workout-movements
  //Get the workout movements for a certain workout event
  router.get('/:event_id/workout-movements', async (req, res) => {
    const { event_id }= req.params;

    try {
        const results = await db.query(`
        SELECT 
            mtw.*, m.name as movement_name, m.*, wam.muscle_group_id, mg.name
        FROM 
            movement_trained_in_workout mtw
        INNER JOIN 
            movements m ON mtw.movement_id = m.movement_id
        INNER JOIN 
            workout_affects_muscle wam ON m.movement_id = wam.movement_id
        INNER JOIN
            muscle_group mg ON wam.muscle_group_id = mg.muscle_group_id
        WHERE 
            mtw.event_id = $1;
    `, [event_id]);
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//POST http://localhost:3001/workout-events/:event_id/workout-movements
//For creating a workout movement for a given event
router.post('/:event_id/workout-movements', async (req, res) => {
  const { event_id } = req.params;
  const { sets, reps, movement_id } = req.body;

  if (!sets || !reps || !movement_id) {
      return res.status(400).send('Sets, reps, and movement ID are required');
  }

  try {
      const result = await db.query(`INSERT INTO movement_trained_in_workout (event_id, sets, reps, movement_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [event_id, sets, reps, movement_id]);
      const newMovementTrainedInWorkout = result.rows[0];
      res.status(201).json(newMovementTrainedInWorkout);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});
  
  module.exports = router;

