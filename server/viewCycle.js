const db = require('./db'); 

async function fetchWorkoutCycleData(cycle_id) {
    try {
        const { rows: WorkoutCycles } = await db.query('SELECT * FROM workout_cycle WHERE cycle_id = $1', [cycle_id]);
        let workoutCycle = WorkoutCycles[0];
        let workoutDays = [];

        const trainingDaysResult = await db.query('SELECT * FROM training_day WHERE cycle_id = $1 ORDER BY training_day_id', [workoutCycle.cycle_id]);
        workoutDays = trainingDaysResult.rows;

        for (const day of workoutDays) {
            const eventsResult = await db.query('SELECT * FROM workout_event WHERE training_day_id = $1 ORDER BY event_id', [day.training_day_id]);
            day.workout_events = eventsResult.rows;

            for (const event of day.workout_events) {
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
            }
        }

        return {
            ...workoutCycle,
            workout_days: workoutDays
        };
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

fetchWorkoutCycleData(9)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error('Failed to fetch workout cycle data:', err));
