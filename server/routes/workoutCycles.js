const express = require('express');
const router = express.Router();
const db = require('../db');

//GET http://localhost:3001/workout-cycles/:cycle_id
//Fetching lots of data for workout plan view: the cycle name, training (and rest) days, workout events and the worked muscle groups per event
/*
{
  "cycle_id": 8,
  "user_id": "user_2Wtl6nOCJyyfUWDGkrGTPCAsGdZ",
  "name": "Markuksen cycle",
  "workout_days": [
    {
      "training_day_id": 29,
      "is_rest_day": false,
      "order_in_cycle": 1,
      "cycle_id": 8,
      "workout_events": [
        {
          "event_id": 1,
          "name": "Push workout",
          "training_day_id": 29,
          "order_in_day": 1,
          "muscle_groups": [
            {
              "muscle_group_id": 4,
              "name": "Triceps"
            },
            {
              "muscle_group_id": 2,
              "name": "Chest"
            }
          ]
        },
        {
          "event_id": 4,
          "name": "Empty second workout event",
          "training_day_id": 29,
          "order_in_day": 2,
          "muscle_groups": []
        }
      ]
    }, 

    ...

  ]
}
*/
router.get('/:cycle_id', async (req, res) => {
  const { cycle_id } = req.params;

  try {
    const { rows: WorkoutCycles } = await db.query('SELECT * FROM workout_cycle WHERE cycle_id = $1', [cycle_id]);
    let workoutCycle = WorkoutCycles[0];
    let workoutDays = [];
    let statusCode = 200;

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
    
    res.status(statusCode).json({
      ...workoutCycle,
      workout_days: workoutDays
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//PUT http://localhost:3001/workout-cycles/:cycle_id
//to update the name of a user's workout cycle. Nothing else can be updated
router.put('/:cycle_id', async (req, res) => {
    const { cycle_id } = req.params;
    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }

      try {
        const { rows } = await db.query(`UPDATE workout_cycle SET name = $1 WHERE cycle_id = $2 RETURNING *;`, [name.trim(), cycle_id]);
    
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Workout cycle not found for the given cycle_id' });
        }
    
        res.status(200).json(rows[0]);

      } catch (err) {
        console.error('Error updating workout_cycle:', err);
        res.status(500).send('Internal Server Error');
      }
    });

//GET http://localhost:3001/workout-cycles/:cycle_id/volume-feedback
//To get the weekly volume. Result is an array of muscle_groups with id, name, weekly volume and a tag (correct/low/high).
// 10-20 REPS is the correct weekly volume
/*
[
  {
    "muscle_group_id": 1,
    "name": "Back",
    "total_sets": "6",
    "tag": "low"
  },
  {
    "muscle_group_id": 2,
    "name": "Chest",
    "total_sets": "13",
    "tag": "correct"
  },
  {
    "muscle_group_id": 3,
    "name": "Biceps",
    "total_sets": "23",
    "tag": "high"
  },
  ...
]
*/ 
router.get('/:cycle_id/volume-feedback', async (req, res) => {
  try {
      const { cycle_id } = req.params;
      const query = `
      SELECT 
        mg.muscle_group_id, 
        mg.name, 
        COALESCE(SUM(mtw.sets), 0) as total_sets,
        CASE 
          WHEN COALESCE(SUM(mtw.sets), 0) BETWEEN 10 AND 20 THEN 'correct'
          WHEN COALESCE(SUM(mtw.sets), 0) < 10 THEN 'low'
          ELSE 'high'
        END as tag
      FROM muscle_group mg
      LEFT JOIN workout_affects_muscle wam ON mg.muscle_group_id = wam.muscle_group_id
      LEFT JOIN movement_trained_in_workout mtw ON wam.movement_id = mtw.movement_id
      LEFT JOIN workout_event we ON mtw.event_id = we.event_id
      LEFT JOIN training_day td ON we.training_day_id = td.training_day_id
      WHERE td.cycle_id = $1
      GROUP BY mg.muscle_group_id, mg.name
      ORDER BY mg.muscle_group_id;
      `;
      const results = await db.query(query, [cycle_id]);
      res.json(results.rows);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
});


//GET http://localhost:3001/workout-cycles/:cycle_id/musclegroup-rest-feedback
//Get an array of musclegroups and for each musclegroup a boolean field that indicates if there are no back-to-back training sessions
/* 
[
  {
    "muscle_group_id": 1,
    "name": "Back",
    "enough_rest": true
  },
  {
    "muscle_group_id": 2,
    "name": "Chest",
    "enough_rest": false
  },
  ...
]
*/
router.get('/:cycle_id/musclegroup-rest-feedback', async (req, res) => {
  const { cycle_id } = req.params;

  try {
    const muscleGroupsResult = await db.query(`SELECT DISTINCT muscle_group.muscle_group_id, muscle_group.name FROM muscle_group`);
    let muscleGroups = muscleGroupsResult.rows.map(mg => ({ ...mg, enough_rest: true }));

    const trainingDaysResult = await db.query(`
      SELECT 
        training_day.training_day_id, 
        training_day.order_in_cycle, 
        workout_affects_muscle.muscle_group_id
      FROM 
        training_day
      JOIN workout_event ON training_day.training_day_id = workout_event.training_day_id
      JOIN movement_trained_in_workout ON workout_event.event_id = movement_trained_in_workout.event_id
      JOIN workout_affects_muscle ON movement_trained_in_workout.movement_id = workout_affects_muscle.movement_id
      WHERE 
        training_day.cycle_id = $1
      ORDER BY 
        training_day.order_in_cycle, training_day.training_day_id
    `, [cycle_id]);

    let dayMuscleGroups = {};
    let lastDayMuscleGroups = new Set();

    for (const day of trainingDaysResult.rows) {
      if (!dayMuscleGroups[day.order_in_cycle]) {
        dayMuscleGroups[day.order_in_cycle] = new Set();
      }
      dayMuscleGroups[day.order_in_cycle].add(day.muscle_group_id);

      if (day.order_in_cycle === 7) {
        lastDayMuscleGroups.add(day.muscle_group_id);
      }
    }

    Object.keys(dayMuscleGroups).forEach(dayOrder => {
      const currentDayMuscleGroups = dayMuscleGroups[dayOrder];
      const previousDayMuscleGroups = dayMuscleGroups[dayOrder - 1] || (dayOrder == 1 ? lastDayMuscleGroups : new Set());

      for (const mgId of currentDayMuscleGroups) {
        if (previousDayMuscleGroups.has(mgId)) {
          muscleGroups = muscleGroups.map(mg => 
            mg.muscle_group_id === mgId ? { ...mg, enough_rest: false } : mg
          );
        }
      }
    });

    muscleGroups.sort((a, b) => a.muscle_group_id - b.muscle_group_id);
    res.json(muscleGroups);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
