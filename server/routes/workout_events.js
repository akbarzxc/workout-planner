const express = require('express');
const router = express.Router();
const db = require('../db')

router.post('/create', async (req, res) => {
    const { training_day_id, name, order_in_day } = req.body;

    if (!training_day_id || !order_in_day ) {
      return res.status(400).json({ error: 'training_day_id and/or order_in_day is required' });
    }
  
    try {
      const trainingDayCheck = await db.query('SELECT * FROM training_day WHERE training_day_id = $1', [training_day_id]);
      if (trainingDayCheck.rows.length === 0) {
        return res.status(404).json({ error: 'corresponding training_day not found' });
      }
  
      const insertQuery = `
        INSERT INTO workout_event (name, training_day_id, order_in_day)
        VALUES ($1, $2, $3)
        RETURNING *;`;
      const values = [name || 'My Workout', training_day_id, order_in_day || trainingDayCheck.rows.length + 1]; // Default order to the next number
  
      const { rows } = await db.query(insertQuery, values);
      const newWorkoutEvent = rows[0];
  
      res.status(201).json(newWorkoutEvent);
    } catch (err) {
      console.error('Error creating new workout_event:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.put('/update', async (req, res) => {
    const { event_id, name, order_in_day } = req.body;
  
    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }
  
    try {
      // Update the workout_event in the database
      const updateQuery = `
        UPDATE workout_event
        SET name = COALESCE($1, name), 
            order_in_day = COALESCE($2, order_in_day)
        WHERE event_id = $3
        RETURNING *;`;
      const values = [name, order_in_day, event_id];
  
      const { rows } = await db.query(updateQuery, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Workout event not found' });
      }
      const updatedWorkoutEvent = rows[0];
  
      // Successfully updated the workout_event
      res.status(200).json(updatedWorkoutEvent);
    } catch (err) {
      console.error('Error updating workout_event:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  /*
  router.delete('/workoutevent/delete', async (req, res) => {
    const { event_id, training_day_id } = req.body;
  
    if (!event_id || !training_day_id) {
      return res.status(400).json({ error: 'event_id and training_day_id are required' });
    }
  
    try {
      // Delete the workout_event from the database
      const deleteQuery = `
        DELETE FROM workout_event
        WHERE event_id = $1 AND training_day_id = $2
        RETURNING *;`;
      const values = [event_id, training_day_id];
  
      const { rows } = await db.query(deleteQuery, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Workout event not found' });
      }
  
      // Successfully deleted the workout_event
      res.status(200).json({ message: 'Workout event successfully deleted', deletedWorkoutEvent: rows[0] });
    } catch (err) {
      console.error('Error deleting workout_event:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  */
  module.exports = router;

