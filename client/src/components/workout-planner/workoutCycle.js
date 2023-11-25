import React from "react";
import TrainingDay from "./trainingDay";

import workoutCycleService from "../../services/workoutCycleService";
import { useQuery } from "react-query";
import { useAuth } from "@clerk/clerk-react";

import movementService from "../../services/movementService";
export default function WorkoutCycle() {
  const { userId, getToken } = useAuth();

  const cycleService = workoutCycleService();

  const muscleMovementService = movementService();

  const fetchMovements = async () => {
    const token = await getToken();
    return muscleMovementService.getMovements(token);
  };

  const fetchWorkoutCycle = async () => {
    const token = await getToken();
    return cycleService.getWorkoutCycle(token, userId);
  };

  const cycleQuery = useQuery("workoutCycle", fetchWorkoutCycle);
  const movementQuery = useQuery("movements", fetchMovements);
  console.log(cycleQuery.data);
  return (
    <div className="flex flex-row min-w-full justify-center space-x-4 border-b py-8 border-b-slate-400">
      {cycleQuery.isLoading || movementQuery.isLoading ? (
        <div>Workout days loading</div>
      ) : (
        cycleQuery.data?.workout_days
          .sort((a, b) => a.order_in_cycle - b.order_in_cycle)
          .map((workout_day) => (
            <TrainingDay
              key={workout_day.training_day_id}
              training_day={workout_day}
              movements={movementQuery.data}
            />
          ))
      )}
    </div>
  );
}
