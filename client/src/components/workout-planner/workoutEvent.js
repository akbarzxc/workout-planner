import { Plus, X } from "lucide-react";
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import workoutEventService from "../../services/workoutEventService";
import { useMutation } from "react-query";

export default function WorkoutEvent({
  event,
  DeleteEventState,
  UpdateEventState,
}) {
  const { getToken } = useAuth();
  const eventService = workoutEventService();

  const DeleteEvent = async () => {
    const token = await getToken();
    eventService.deleteWorkoutEvent(token, event.event_id);
    DeleteEventState(event.event_id);
  };

  const UpdateName = (newName) => {
    var updated = {
      ...event,
      name: newName,
    };
    UpdateEventState(updated);
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const token = await getToken();
      eventService.putWorkoutEvent(token, event);
    }
  };
  const deleteMutation = useMutation(DeleteEvent);

  return (
    <div className="flex flex-col whitespace-nowrap justify-between bg-white px-4 py-2 my-2 rounded-2xl w-full text-lg">
      <div className="flex flex-row justify-between">
        <input
          className="w-3/4"
          type="text"
          value={event.name}
          onChange={(e) => UpdateName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="text-red-400 hover:text-red-200"
          onClick={deleteMutation.mutate}
        >
          <X size={28} />
        </button>
      </div>
      <div>
        {event.muscle_groups?.map((item, index) => (
          <div key={index}>{"item.name"}</div>
        ))}
      </div>
      <button className="flex flex-row items-center text-slate-800 text-md space-x-2 hover:text-slate-500">
        <Plus size={20} />
        <div>Add Movement</div>
      </button>
    </div>
  );
}
