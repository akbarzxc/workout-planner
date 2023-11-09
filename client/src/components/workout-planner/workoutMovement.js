import React from "react";

export default function WorkoutMovement() {
  var test_props = {
    name: "Leg Workout",
    is_rest_day: false,
    affectedMuscles: [
      {
        name: "Quads",
      },
      {
        name: "Calves",
      },
    ],
  };
  // Round 25
  return (
    <button className="flex flex-col bg-white px-4 py-2 my-2 rounded-2xl hover:bg-slate-50">
      <div>{test_props.name}</div>
      <div>
        {test_props.affectedMuscles.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      </div>
    </button>
  );
}
