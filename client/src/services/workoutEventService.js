import api, { setSessionToken } from "./api";

const workoutEventService = () => {
  const deleteWorkoutEvent = async (sessionToken, event_id) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.delete(`/workout-events/${event_id}`);
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return {
    deleteWorkoutEvent,
  };
};

export default workoutEventService;
