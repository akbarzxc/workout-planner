const db = require('./db'); 

async function fetchWorkoutEventsForDay(order_in_cycle) {
    if (!order_in_cycle) {
        console.log('order_in_cycle is required');
        return;
    }

    try {
        // Fetch the first (or only) workout cycle ID
        const cycleResult = await db.query('SELECT cycle_id FROM workout_cycle LIMIT 1');
        const cycleId = cycleResult.rows[0]?.cycle_id;

        if (!cycleId) {
            console.error('No workout cycle found');
            return;
        }

        // Fetch the training day based on order_in_cycle
        const trainingDaysResult = await db.query(`
            SELECT * FROM training_day 
            WHERE cycle_id = $1 AND order_in_cycle = $2
        `, [cycleId, order_in_cycle]);
        const trainingDay = trainingDaysResult.rows[0];

        if (!trainingDay) {
            console.log('No training day found for the given order_in_cycle');
            return;
        }

        // Fetch workout events for the training day
        const eventsResult = await db.query(`
            SELECT * FROM workout_event 
            WHERE training_day_id = $1 
            ORDER BY order_in_day
        `, [trainingDay.training_day_id]);
        const workoutEvents = eventsResult.rows;

        for (const event of workoutEvents) {
            const muscleGroupsResult = await db.query(`
              SELECT DISTINCT
                muscle_group.muscle_group_id,
                muscle_group.name
              FROM
                workout_event
              JOIN
                movement_trained_in_workout
                ON workout_event.event_id = movement_trained_in_workout.event_id
              JOIN
                movements
                ON movement_trained_in_workout.movement_id = movements.movement_id
              JOIN
                workout_affects_muscle
                ON movements.movement_id = workout_affects_muscle.movement_id
              JOIN
                muscle_group
                ON workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
              WHERE
                workout_event.event_id = $1
            `, [event.event_id]);
      
            event.muscle_groups = muscleGroupsResult.rows;
      
            const movementsResult = await db.query(`
              SELECT 
                movement_trained_in_workout.*, 
                movements.name AS movement_name,
                workout_affects_muscle.muscle_group_id, 
                muscle_group.name AS muscle_group_name
              FROM 
                movement_trained_in_workout
              JOIN 
                movements ON movement_trained_in_workout.movement_id = movements.movement_id
              JOIN 
                workout_affects_muscle ON movements.movement_id = workout_affects_muscle.movement_id
              JOIN
                muscle_group ON workout_affects_muscle.muscle_group_id = muscle_group.muscle_group_id
              WHERE 
                movement_trained_in_workout.event_id = $1
            `, [event.event_id]);
      
            event.movements = movementsResult.rows;
          }

        console.log(JSON.stringify({
            ...trainingDay,
            workout_events: workoutEvents
        }, null, 2));
    } catch (err) {
        console.error('Error fetching workout events for the day:', err);
    }
}

// Example usage: fetch workout events for cycle_id 9 and Monday (order_in_cycle 1)
fetchWorkoutEventsForDay(1);
