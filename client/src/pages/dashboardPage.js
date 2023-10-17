import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="../workoutplan">Click to view workout planner</Link>
    </div>
  );
}
