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
  
  module.exports = router;

