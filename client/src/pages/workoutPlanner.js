import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getMuscleGroups } from '../services/muscleGroupService'

export default function WorkoutPlanner() {
    const [muscleGroups, setMuscleGroups] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
      getMuscleGroups()
      .then(data => {
        setMuscleGroups(data)
      })
      .catch(err => {
        setError(err)
      })
    }, [])

  return (
    <div>
      <h1>Workout Planner</h1>
      <Link to="../dashboard">Click to view dashboard</Link>
      
      <h2>Choose your target muscle groups:</h2>
      <ul>
        {muscleGroups.map(muscleGroup => (
          <li key={muscleGroup.id}>{muscleGroup.name}</li>
        ))}
      </ul>
    </div>
  );
}
