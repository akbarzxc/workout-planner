import React from "react";
import { useState } from "react";
import WorkoutEvent from "./workoutEvent";

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
export default function TrainingDay({ movements, training_day }) {
  const [trainingDay, setTrainingDay] = useState(training_day);
  const { getToken } = useAuth();
  const dayService = trainingDayService();

  const ToggleIsRestDay = async () => {
    trainingDay.is_rest_day = !trainingDay.is_rest_day;
    const token = await getToken();
    setTrainingDay(trainingDay);
    return dayService.putTrainingDay(token, trainingDay);
  };

  const restDayMutation = useMutation(ToggleIsRestDay);

  const CreateEvent = async () => {
    const token = await getToken();
    let response = await dayService.postTrainingDayEvent(
      token,
      trainingDay.training_day_id,
      "New Workout",
      trainingDay.workout_events.length + 1
    );
    trainingDay.workout_events.push(response);
    setTrainingDay(trainingDay);
  };

  const addEventMutation = useMutation(CreateEvent);

  const DeleteEventState = (event_id) => {
    var updatedDay = {
      ...trainingDay,
      workout_events: trainingDay.workout_events.filter(
        (event) => event.event_id !== event_id
      ),
    };
    setTrainingDay(updatedDay);
  };
  const UpdateEventState = (event) => {
    var updatedDay = {
      ...trainingDay,
      workout_events: trainingDay.workout_events.map((workoutEvent) =>
        workoutEvent.event_id === event.event_id ? event : workoutEvent
      ),
    };
    setTrainingDay(updatedDay);
  };
  if (trainingDay.is_rest_day) {
    return (
      <button
        className="bg-slate-200 rounded-2xl w-16 h-16 flex justify-center items-center hover:text-slate-500 hover:bg-slate-100"
        onClick={restDayMutation.mutate}
      >
        <Sun size={28} />
      </button>
    );
  } else {
    return (
      <div className="flex-col bg-slate-200 rounded-2xl px-4 py-2 items-left w-56 h-min">
        <div className="text-slate-700 text-xl flex justify-between">
          {dayNames[trainingDay.order_in_cycle - 1]}
          <button
            className="hover:text-slate-500"
            onClick={restDayMutation.mutate}
          >
            <CalendarCheck size={28} />
          </button>
        </div>
        <div className="col-span-2">
          {trainingDay?.workout_events
            .sort((a, b) => a.order_in_day - b.order_in_day)
            .map((event) => (
              <WorkoutEvent
                key={event.event_id}
                event={event}
                movements={movements}
                DeleteEventState={DeleteEventState}
                UpdateEventState={UpdateEventState}
              />
            ))}
        </div>
        <button
          onClick={addEventMutation.mutate}
          className="flex flex-row items-center text-slate-800 text-lg space-x-2 hover:text-slate-500"
        >
          <Plus size={28} />
          <div>Add Event</div>
        </button>
      </div>
    );
  }
}
