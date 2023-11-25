import api, { setSessionToken } from "./api";

const analysisService = () => {
  const getVolumeAnalysis = async (sessionToken, userID) => {
    try {
      setSessionToken(sessionToken);
      const idResponse = await api.get(`/users/${userID}/workout-cycle`);
      const response = await api.get(
        `/workout-cycles/${idResponse.data.cycle_id}/volume-feedback`
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const getRestAnalysis = async (sessionToken, userID) => {
    try {
      setSessionToken(sessionToken);
      const idResponse = await api.get(`/users/${userID}/workout-cycle`);
      console.log(idResponse.data.cycle_id);
      const response = await api.get(
        `/workout-cycles/${idResponse.data.cycle_id}/musclegroup-rest-feedback`
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return {
    getVolumeAnalysis,
    getRestAnalysis,
  };
};

export default analysisService;
