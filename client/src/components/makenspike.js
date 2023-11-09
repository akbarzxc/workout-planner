import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";

import muscleGroupService from "../services/muscleGroupService";

export default function WorkoutPlanner() {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();
  const service = muscleGroupService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const data = await service.getMuscleGroups(token);
        setMuscleGroups(data);
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

      <h2>Choose your target muscle groups:</h2>
      <ul>
        {muscleGroups.map((muscleGroup) => (
          <li key={muscleGroup.id}>{muscleGroup.name}</li>
        ))}
      </ul>
    </div>
  );
}
