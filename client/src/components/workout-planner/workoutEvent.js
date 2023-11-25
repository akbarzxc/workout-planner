import { X } from "lucide-react";
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import workoutEventService from "../../services/workoutEventService";
import { useMutation } from "react-query";

export default function WorkoutEvent({ event, DeleteEventState }) {
  const { getToken } = useAuth();
  const eventService = workoutEventService();

  const DeleteEvent = async () => {
    const token = await getToken();
    eventService.deleteWorkoutEvent(token, event.event_id);
    DeleteEventState(event.event_id);
  };

  const deleteMutation = useMutation(DeleteEvent);

  return (
    <button className="flex justify-between bg-white px-4 py-2 my-2 rounded-2xl w-full text-lg hover:bg-slate-50">
      <div className="flex flex-col whitespace-nowrap">
        <div>{event.name}</div>
        <div>
          {event.muscle_groups?.map((item, index) => (
            <div key={index}>{"item.name"}</div>
          ))}
        </div>
      </div>
      <button
        className="text-red-400 hover:text-red-200"
        onClick={deleteMutation.mutate}
      >
        <X size={28} />
      </button>
    </button>
  );
}
