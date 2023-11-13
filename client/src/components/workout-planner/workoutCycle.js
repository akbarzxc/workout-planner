import React from "react";
import WorkoutEvent from "./workoutEvent";

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
  console.log(query);
  return (
    <div className="flex flex-row min-w-full justify-center space-x-4 border-b py-8 border-b-slate-400">
      {query.isLoading ? (
        <div>Workout days loading</div>
      ) : (
        query.data?.workout_days.map((workout_day) => (
          <WorkoutEvent key={workout_day.training_day_id} event={workout_day} />
        ))
      )}
    </div>
  );
}
