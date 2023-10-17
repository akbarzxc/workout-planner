import React from "react";
import { Link } from "react-router-dom";

export default function WorkoutPlanner() {
  return (
    <div>
      <h1>Workout Planner</h1>
      <Link to="../dashboard">Click to view dashboard</Link>
    </div>
  );
}
