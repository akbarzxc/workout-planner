const db = require('./db');

async function fetchAllWorkoutMovements() {
    try {
        const results = await db.query(`
            SELECT 
                mtw.*, 
                m.name as movement_name, 
                m.*, 
                wam.muscle_group_id, 
                mg.name as muscle_group_name
            FROM 
                movement_trained_in_workout mtw
            INNER JOIN 
                movements m ON mtw.movement_id = m.movement_id
            INNER JOIN 
                workout_affects_muscle wam ON m.movement_id = wam.movement_id
            INNER JOIN
                muscle_group mg ON wam.muscle_group_id = mg.muscle_group_id
        `); 

        console.log('All Workout Movements:', results.rows);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchAllWorkoutMovements();
