import React from "react";
import WorkoutEvent from "./workoutEvent";

// var props = [0, 1, 2, 3];

var event_test_props = {
  name: "Monday",
  is_rest_day: false,
};
var rest_event_test_props = {
  name: "Tuesday",
  is_rest_day: true,
};
export default function WorkoutCycle() {
  return (
    <div className="flex flex-row min-w-full justify-center space-x-4 border-b py-8 border-b-slate-400">
      <WorkoutEvent {...event_test_props} />
      <WorkoutEvent {...rest_event_test_props} />
    </div>
  );
}
