import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { Cog, CalendarClock } from 'lucide-react';

import workoutCycleService from "../services/workoutCycleService";
import trainingDayService from "../services/trainingDayService";
import userService from "../services/userService";

import logo from "../voima_icon.png";


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
        <div className="rounded-3xl bg-orange-200 max-w-lg mt-10 p-5">
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


    const [isModalOpen, setModalOpen] = useState(false);

    const { getToken, userId } = useAuth();
    const [todaysWorkouts, setTodaysWorkouts] = useState([]);

    const userServices = userService();
    const dayService = trainingDayService();
    const cycleService = workoutCycleService();
    
    const navigate = useNavigate();
    const { signOut } = useClerk();
    
    const handleDeleteUser = async () => {
        try {
          const token = await getToken();
          await userServices.deleteUser(token, userId);
          signOut();
          navigate("/");
        } catch (error) {
          console.error("Error deleting the user account:", error);
        }
      };

    useEffect(() => {
        const fetchTodaysWorkoutEvents = async () => {
        try {
            const token = await getToken();
            // Fetch the user's workout cycle
            const workoutCycle = await cycleService.getWorkoutCycle(token, userId);

            // Determine the current day of the week
            const today = new Date();
            const orderInCycleToday = today.getDay() || 7; // Assuming 1 = Monday, 7 = Sunday

            // Find today's training day ID
            const todaysTrainingDay = workoutCycle.workout_days.find(day => day.order_in_cycle === orderInCycleToday);

            if (todaysTrainingDay) {
            // Fetch workout events for today's training day
            const events = await dayService.getWorkoutEventsForDay(token, todaysTrainingDay.training_day_id);
            setTodaysWorkouts(events);
            }
        } catch (error) {
            console.error("Error fetching today's workout events:", error);
        }
        };

        fetchTodaysWorkoutEvents();
    }, [userId]);
        

    return (
        <div>
            <Header>
                <div class="hidden items-center space-x-2 md:flex">
                    <img src={logo} alt="logo" className="h-14" />
                    <h1 className="hidden sm:inline-block text-lg font-bold">
                        Voima
                    </h1>
                </div>
            </Header>
            <div class=" fixed bg-white w-screen h-20 top-16 ml-80 border-b-2">
                <div className="pl-11">
                    <h1>{formattedDate}</h1>
                    <h1 class=" font-bold font-inter text-4xl">Today's Workout</h1>
                </div>
            </div>
            <SideBar>
                <Link to="/workoutplan" className="flex flex-row hover:bg-gray-200 w-full">
                    <CalendarClock className="h-5 w-5" />
                    <span className="pl-3">Workout Plan</span>
                </Link>
                <button 
                onClick={() => setModalOpen(true)} 
                className="flex flex-row hover:bg-gray-200 w-full"
                >
                <Cog className="h-5 w-5" />
                <span className="pl-3">Settings</span>
                </button>
                {isModalOpen && (
                    <Modal show={isModalOpen} onClose={() => setModalOpen(false)} centered>
                    <Modal.Header>
                        Settings
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                        <p>ACCOUNT</p>
                        <div className="mt-4">
                            <button 
                            onClick={handleDeleteUser}
                            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                            Delete User
                            </button>
                        </div>
                        <div className="mt-4">
                            <SignOutButton />
                        </div>
                        </div>
                    </Modal.Body>
                    </Modal>
                )}                
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

