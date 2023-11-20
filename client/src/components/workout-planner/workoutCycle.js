import React from "react";
import TrainingDay from "./trainingDay";

import workoutCycleService from "../../services/workoutCycleService";
import { useQuery } from "react-query";
import { useAuth } from "@clerk/clerk-react";

export default function WorkoutCycle() {
  const { userId, getToken } = useAuth();

  const cycleService = workoutCycleService();

  const fetchWorkoutCycle = async () => {
    const token = await getToken();
    return cycleService.getWorkoutCycle(token, userId);
  };

  const query = useQuery("workoutCycle", fetchWorkoutCycle);
  return (
    <div className="flex flex-row min-w-full justify-center space-x-4 border-b py-8 border-b-slate-400">
      {query.isLoading ? (
        <div>Workout days loading</div>
      ) : (
        query.data?.workout_days
          .sort((a, b) => a.order_in_cycle - b.order_in_cycle)
          .map((workout_day) => (
            <TrainingDay
              key={workout_day.training_day_id}
              training_day={workout_day}
            />
          ))
      )}
    </div>
  );
}
