import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';

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
  //Please keep the token inside dashboard, so when testing 
  //the API I can see and copy the token of my user...
  const { getToken } = useAuth();
  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    const fetchUserToken = async () => {
        const token = await getToken();
        setUserToken(token);
    };
    fetchUserToken();
  }, []);

  const { user } = useUser()
  const firstName = user.firstName //user.id for id

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {firstName}</h2>
      <div>
        <Link to="../workoutplan">Click to view workout planner</Link>
      </div>
      <SignOutButton />


      <br></br><br></br><br></br>
      <p>{userToken}</p>
    </div>
  );
}
