import api, { setSessionToken } from "./api";

const trainingDayService = () => {
  const putTrainingDay = async (sessionToken, training_day) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.put(
        `/training-days/${training_day.training_day_id}`,
        training_day
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return {
    putTrainingDay,
  };
};

export default trainingDayService;
