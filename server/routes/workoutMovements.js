const express = require('express');
const router = express.Router();
const db = require('../db')

router.put('/:relation_id', async (req, res) => {
    const { relation_id } = req.params;
    const { sets, reps, movement_id } = req.body;

    if (!sets || !reps || !movement_id) {
        return res.status(400).send('Sets, reps, and movement ID are required');
    }

    try {
        await db.query(`UPDATE movement_trained_in_workout SET sets = $1, reps = $2, movement_id = $3 WHERE relation_id = $4;`, [sets, reps, movement_id, relation_id]);
        res.status(200).send('Movement updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.delete('/:relation_id', async (req, res) => {
    const { relation_id } = req.params;

    try {
        await db.query(`DELETE FROM movement_trained_in_workout WHERE relation_id = $1;`, [relation_id]);
        res.status(200).send('Movement deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;