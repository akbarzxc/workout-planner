const express = require('express');
const router = express.Router();
const db = require('../db');

//GET http://localhost:3001/users/:user_id/workout-cycle
//Get the users workout cycle. If one does not exist, create one 
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

module.exports = router;