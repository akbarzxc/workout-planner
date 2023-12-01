import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';

import logo from "../voima_icon.png";
import stt from "../setting_icon.png";
import wrk from "../workout_icon.png";


const SignOutButton = () => {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    return (
        <button
            onClick={() => {
                signOut();
                navigate("/");
            }}
            className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-slate-900 px-6 py-1 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
        >
            Sign out
        </button>
    );
};


function WorkoutBox({ workouts }) {
    return (
        <div className="rounded-3xl bg-orange-200 w-full mt-10 p-5">
            {workouts.map((workout, index) => (
                <div key={index} className="mb-4">
                    <h2 className="text-lg font-bold">{workout.name}</h2>
                    <div className="mt-2">
                        {workout.muscle_groups.map((muscle, idx) => (
                            <span key={idx} className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{muscle.name}</span>
                        ))}
                    </div>
                    <table className="min-w-full leading-normal mt-2">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Movement
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Sets
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Reps
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {workout.movements.map((movement, idx) => (
                                <tr key={idx}>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {movement.movement_name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {movement.sets}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {movement.reps}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}



function Button({value, src, to}) {
    return (
        <Link className="hover:bg-gray-200 bg-yellow flex flex-row" to={to}>
            <img src={src} className="h-5 w-5"></img>
            <h1 className="pl-3">{value}</h1>
        </Link>
    );
}


function SideBar({ children }) {
    return (
        <div className="fixed top-16 w-80 bg-white h-screen pl-40 py-3 border-r-2">
            {children}
        </div>
    );
}


function Header({ children }) {
    return (
        <div className="fixed top-0 h-16 w-screen  bg-white px-40 flex flex-row  border-b-2 flex justify-between" >
            {children}
        </div>
    );
}


function Main({ children }) {
    return (
        <div className="ml-80 flex-1 bg-white pl-11 pt-28">
            {children}
        </div>
    );
}


export default function DashboardPage() {
    let currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).replace(/,\s+/g, ' ');

    const { getToken } = useAuth();
    const [userToken, setUserToken] = useState(null);
    const [todaysWorkouts, setTodaysWorkouts] = useState([]);

    useEffect(() => {
        const fetchUserToken = async () => {
            const token = await getToken();
            setUserToken(token);
        };
        fetchUserToken();
    }, []);

    useEffect(() => {
        // Determine the current day of the week as a number (1 for Monday, 2 for Tuesday, etc.)
        const currentDayNumber = new Date().getDay() || 7; // Convert Sunday (0) to 7
    
        if (userToken) {
            fetch(`http://localhost:3001/workout-day/${currentDayNumber}`, { 
                headers: { 'Authorization': `Bearer ${userToken}` } 
            })
                .then(response => response.json())
                .then(data => {
                    // Checking if data.workout_events is present and not null
                    setTodaysWorkouts(data.workout_events ?? []);
                })
                .catch(error => {
                    console.error('Error fetching today\'s workout:', error);
                });
        }
    }, [userToken]);
    
    

  

    return (
        <div>
            <Header>
                <Link to="/" class="hidden items-center space-x-2 md:flex">
                    <img src={logo} alt="logo" className="h-14" />
                    <h1 className="hidden sm:inline-block text-lg font-bold">
                        Voima
                    </h1>
                </Link>
                <SignOutButton />
            </Header>
            <div class=" fixed bg-white w-screen h-20 top-16 ml-80 border-b-2">
                <div className="pl-11">
                    <h1>{formattedDate}</h1>
                    <h1 class=" font-bold font-inter text-4xl">Today's Workout</h1>
                </div>
            </div>
            <SideBar>
                
                <Button value={"Workout Plan"} src={wrk} to={"/workoutplan"} / >
                <Button value={"Settings"} src={stt} to={"/settings"} />

            </SideBar>
            <Main>
                <div className="grid sm-grid-cols-1 gap-4">
                
                    {todaysWorkouts.length > 0 ? (
                            <WorkoutBox workouts={todaysWorkouts} />
                        ) : (
                            <div className="mt-10 text-center text-lg">
                                Rest day - no training scheduled for today.
                            </div>
                        )}
                </div>
            </Main>
            
            
        </div>
    );
}

