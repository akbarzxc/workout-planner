import React from "react";
import WorkoutMovement from "./workoutMovement";

import { Plus, Sun } from "lucide-react";

export default function WorkoutEvent({ event }) {
  if (event.is_rest_day) {
    return (
      <button className="bg-slate-200 rounded-2xl w-16 h-16 flex justify-center items-center hover:text-slate-500 hover:bg-slate-100">
        <Sun size={28} />
      </button>
    );
  } else {
    return (
      <div className="flex-col bg-slate-200 rounded-2xl px-4 py-2 items-left w-48">
        <div className="text-slate-700 text-xl">{event.cycle_id}</div>
        <WorkoutMovement />
        <button className="flex flex-row items-center text-slate-800 text-lg space-x-2 hover:text-slate-500">
          <Plus size={28} />
          <div>Add Event</div>
        </button>
      </div>
    );
  }
}
