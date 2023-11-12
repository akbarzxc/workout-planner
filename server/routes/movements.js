const express = require('express');
const router = express.Router();
const db = require('../db')


//Note: For the time being all movements are shared among users, we can change this later if time/needed

// GET http://localhost:3001/movements
// For fetching all movements (for a list of adding movements to a workout etc)
router.get('/', async (req, res) => {

    try {
        const results = await db.query(`
        SELECT 
            m.*, 
            mg.muscle_group_id, 
            mg.name AS muscle_group_name
        FROM 
            movements m
        INNER JOIN 
            workout_affects_muscle wam ON m.movement_id = wam.movement_id
        INNER JOIN 
            muscle_group mg ON wam.muscle_group_id = mg.muscle_group_id
        ORDER BY
            m.movement_id;
    `);
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

//POST http://localhost:3001/movements
//for creating a movement (for example Bench press for Chest)
router.post('/', async (req, res) => {
    const { name, description, muscle_group_id } = req.body;

    if (!name || !muscle_group_id) {
        return res.status(400).send('Name and muscle group ID are required');
    }

    try {
        await db.query('BEGIN');
        const movementResult = await db.query(`INSERT INTO movements (name, description) VALUES ($1, $2) RETURNING movement_id;`, [name, description]);
        const movementId = movementResult.rows[0].movement_id;
        await db.query(`INSERT INTO workout_affects_muscle (movement_id, muscle_group_id) VALUES ($1, $2);`, [movementId, muscle_group_id]);
        await db.query('COMMIT');

        res.status(201).send(`movement ${movementId} and muscle group relation created successfully`);
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//PUT http://localhost:3001/movements/:movement_id
//For updating the name and muscle group for a movement
router.put('/:movement_id', async (req, res) => {
    const { movement_id } = req.params;
    const { name, muscle_group_id } = req.body;

    if (!name || !muscle_group_id) {
        return res.status(400).send('Name and muscle group ID are required');
    }

    try {
        await db.query('BEGIN');
        await db.query(`UPDATE movements SET name = $1 WHERE movement_id = $2;`, [name, movement_id]);
        await db.query(`UPDATE workout_affects_muscle SET muscle_group_id = $1 WHERE movement_id = $2;`, [muscle_group_id, movement_id]);
        await db.query('COMMIT');

        res.status(200).send('Movement updated successfully');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//DELETE http://localhost:3001/movements/:movement_id
//For deleting a movement. Not yet implemented.

module.exports = router;