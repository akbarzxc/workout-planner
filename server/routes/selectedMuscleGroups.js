const express = require('express')
const router = express.Router()
const db = require('../db')

//PUT http://localhost:3001/selected-muscle-groups/:relation_id
//For switching a selected muscle group's is_priority

router.put('/:relation_id', async (req, res) => {
    const { relation_id } = req.params;
    const { is_priority } = req.body;

    if (typeof is_priority !== 'boolean') {
        return res.status(400).send('is_priority must be true or false');
    }

    try {
        await db.query(`UPDATE selected_muscle_group SET is_priority = $1 WHERE relation_id = $2;`, [is_priority, relation_id])
        res.status(200).send('Update successful');
    } catch (error) {
        res.status(500).send('Error updating the database');
    }
});

//DELETE http://localhost:3001/selected-muscle-groups/:relation_id
//For removing a selected muscle group from selected list
router.delete('/:relation_id', async (req, res) => {
    try {
        const { relation_id } = req.params;
        const deleteQuery = await db.query('DELETE FROM selected_muscle_group WHERE relation_id = $1 RETURNING *', [relation_id]);

        if (deleteQuery.rowCount === 0) {
            return res.status(404).json({ message: 'No record found to delete' });
        }

        res.json({ message: 'removal successful'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router