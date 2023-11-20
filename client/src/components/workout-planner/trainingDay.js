import React from "react";
import { useState } from "react";
import WorkoutMovement from "./workoutMovement";

import { CalendarCheck, Plus, Sun } from "lucide-react";
import { useMutation } from "react-query";
import { useAuth } from "@clerk/clerk-react";

import trainingDayService from "../../services/trainingDayService";

let dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export default function TrainingDay({ training_day }) {
  const [trainingDay, setTrainingDay] = useState(training_day);
  console.log(trainingDay);
  const { getToken } = useAuth();
  const dayService = trainingDayService();

  const ToggleIsRestDay = async () => {
    trainingDay.is_rest_day = !trainingDay.is_rest_day;
    const token = await getToken();
    setTrainingDay(trainingDay);
    return dayService.putTrainingDay(token, trainingDay);
  };

  const mutation = useMutation(ToggleIsRestDay);

  if (trainingDay.is_rest_day) {
    return (
      <button
        className="bg-slate-200 rounded-2xl w-16 h-16 flex justify-center items-center hover:text-slate-500 hover:bg-slate-100"
        onClick={mutation.mutate}
      >
        <Sun size={28} />
      </button>
    );
  } else {
    return (
      <div className="flex-col bg-slate-200 rounded-2xl px-4 py-2 items-left w-48">
        <div className="text-slate-700 text-xl flex justify-between">
          {dayNames[trainingDay.order_in_cycle - 1]}
          <button className="hover:text-slate-500" onClick={mutation.mutate}>
            <CalendarCheck size={28} />
          </button>
        </div>
        <WorkoutMovement />
        <button className="flex flex-row items-center text-slate-800 text-lg space-x-2 hover:text-slate-500">
          <Plus size={28} />
          <div>Add Event</div>
        </button>
      </div>
    );
  }
}
