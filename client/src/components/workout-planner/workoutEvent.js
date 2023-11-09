import React from "react";
import WorkoutMovement from "./workoutMovement";

import { Plus } from "lucide-react";

export default function WorkoutEvent() {
  var test_props = {
    name: "Monday",
    is_rest_day: false,
  };
  return (
    <div className="flex flex-col bg-slate-200 rounded-2xl px-4 py-2 items-left w-max-256">
      <div className="text-slate-700 text-xl">{test_props.name}</div>
      <WorkoutMovement />
      <button className="flex flex-row items-center text-slate-600 text-lg space-x-2">
        <Plus size={30} strokeWidth={2} />
        <div className="text-slate-500">Add Event</div>
      </button>
    </div>
  );
}
