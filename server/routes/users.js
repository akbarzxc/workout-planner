const express = require('express');
const router = express.Router();
const db = require('../db');


//GET http://localhost:3001/users/:user_id/workout-cycle
//Get the users workout cycle id. If one does not exist, create the cycle with rest days
/*
{
  "cycle_id": 9
}
*/
router.get('/:user_id/workout-cycle', async (req, res) => {
    try {
        const { user_id } = req.params;
        let statusCode = 200;
        const existingCycleResult = await db.query('SELECT cycle_id FROM workout_cycle WHERE user_id = $1', [user_id]);
        let workoutCycle = existingCycleResult.rows[0];

        if (!workoutCycle) {
            const insertedCycle = await db.query('INSERT INTO workout_cycle (user_id) VALUES ($1) RETURNING *', [user_id]);
            workoutCycle = insertedCycle.rows[0];
            const newCycleId = workoutCycle.cycle_id;

            // Create training days for the new cycle, 1 = monday and 7 = sunday
            for (let i = 1; i <= 7; i++) {
                await db.query('INSERT INTO training_day (is_rest_day, order_in_cycle, cycle_id) VALUES ($1, $2, $3)', [true, i, newCycleId]);
            }

            statusCode = 201;
        }
        res.status(statusCode).json({ cycle_id: workoutCycle.cycle_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



//DELETE http://localhost:3001/users/:user_id
router.delete('/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    try {
      await db.query('BEGIN');
      await db.query('DELETE FROM movement_trained_in_workout USING workout_event WHERE workout_event.event_id = movement_trained_in_workout.event_id AND workout_event.training_day_id IN (SELECT training_day_id FROM training_day WHERE cycle_id IN (SELECT cycle_id FROM workout_cycle WHERE user_id = $1))', [user_id]);
      await db.query('DELETE FROM workout_event WHERE training_day_id IN (SELECT training_day_id FROM training_day WHERE cycle_id IN (SELECT cycle_id FROM workout_cycle WHERE user_id = $1))', [user_id]);
      await db.query('DELETE FROM training_day WHERE cycle_id IN (SELECT cycle_id FROM workout_cycle WHERE user_id = $1)', [user_id]);
      await db.query('DELETE FROM workout_cycle WHERE user_id = $1', [user_id]);
      await db.query('COMMIT');
      res.status(200).send(`User ${user_id} data deleted successfully.`);
    } catch (error) {
      await db.query('ROLLBACK');
      res.status(500).send(`Error deleting user: ${error}`);
    }
  });

module.exports = router;