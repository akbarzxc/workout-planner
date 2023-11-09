import React from "react";
import { Link } from "react-router-dom";
import WorkoutCycle from "../components/workout-planner/workoutCycle";
import { Rewind } from "lucide-react";

var test_props = {
  name: "My Workout Plan",
};

export default function WorkoutPlanner() {
  // >
  return (
    <div className="flex min-h-screen flex-col items-center  mx-10">
      <div className="flex w-full items-center justify-between py-4 space-x-20">
        <div className="flex w-2/5 justify-start items-center space-x-4">
          <Link
            to="../dashboard"
            className="flex space-x-2 items-center text-slate-600"
          >
            <Rewind size={30} strokeWidth={2} />
            <div className="px-4 text-lg text-slate-500">Back</div>
          </Link>
          <h1 className="text-4xl whitespace-nowrap font-bold text-slate-700">
            {test_props.name}
          </h1>
        </div>
        <div className="flex w-3/5 justify-end space-x-10">
          <div>placeholder_Saved</div>
          <div>placeholder_Edit</div>
        </div>
      </div>
      <WorkoutCycle />
    </div>
  );
}
