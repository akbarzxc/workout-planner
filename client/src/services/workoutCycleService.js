import api, { setSessionToken } from "./api";

const workoutCycleService = () => {
  const getWorkoutCycle = async (sessionToken, userID) => {
    try {
      setSessionToken(sessionToken);
      const idResponse = await api.get(`/users/${userID}/workout-cycle`);
      const response = await api.get(
        `/workout-cycles/${idResponse.data.cycle_id}`
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return {
    getWorkoutCycle,
  };
};

export default workoutCycleService;
