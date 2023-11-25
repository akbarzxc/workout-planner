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

  const putWorkoutEvent = async (sessionToken, event) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.put(
        `/workout-events/${event.event_id}`,
        event
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const postWorkoutMovement = async (
    sessionToken,
    event_id,
    sets,
    reps,
    movement_id
  ) => {
    try {
      setSessionToken(sessionToken);
      let body = {
        sets,
        reps,
        movement_id,
      };
      console.log(body);
      const response = await api.post(
        `workout-events/${event_id}/workout-movements`,
        body
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const getWorkoutEventMovements = async (sessionToken, event_id) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.get(
        `workout-events/${event_id}/workout-movements`
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const deleteWorkoutEventMovement = async (sessionToken, relation_id) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.delete(`workout-movements/${relation_id}`);
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return {
    deleteWorkoutEvent,
    putWorkoutEvent,
    postWorkoutMovement,
    getWorkoutEventMovements,
    deleteWorkoutEventMovement,
  };
};

export default workoutEventService;
