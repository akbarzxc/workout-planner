import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

const SignOutButton = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => {
        signOut();
        navigate("/");
      }}
    >
      Sign out
    </button>
  );
};

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <Link to="../workoutplan">Click to view workout planner</Link>
      </div>
      <SignOutButton />
    </div>
  );
}
