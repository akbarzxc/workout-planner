import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClerk, useAuth } from '@clerk/clerk-react';

import muscleGroupService from '../services/muscleGroupService'
import workoutCycleService from "../services/workoutCycleService";

export default function WorkoutPlanner() {
    const [muscleGroups, setMuscleGroups] = useState([])
    const [workoutCycle, setWorkoutCycle] = useState(null)
    const [error, setError] = useState(null)

    const { getToken } = useAuth();
    const { user } = useClerk();
    const muscleService = muscleGroupService();
    const cycleService = workoutCycleService();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await getToken();
          const muscleGroupData = await muscleService.getMuscleGroups(token);
          const workoutCycleData = await cycleService.getWorkoutCycle(token, user.id);
          console.log(workoutCycleData.name)
          setMuscleGroups(muscleGroupData);
          setWorkoutCycle(workoutCycleData);
        } catch (err) {
          setError(err);
        }
      };
    
      fetchData();
    }, []);

  return (
    <div>
      <h1>Workout Planner</h1>
      <Link to="../dashboard">Click to view dashboard</Link>
      <h1>Your workout cycle {workoutCycle?.name}</h1>
      <h2>Choose your target muscle groups:</h2>
      <ul>
        {muscleGroups.map(muscleGroup => (
          <li key={muscleGroup.muscle_group_id}>{muscleGroup.name}</li>
        ))}
      </ul>
    </div>
  );
}
