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
  const postTrainingDayEvent = async (
    sessionToken,
    training_day_id,
    name,
    order_in_day
  ) => {
    try {
      setSessionToken(sessionToken);
      let body = {
        name: name,
        order_in_day: order_in_day,
      };
      const response = await api.post(
        `training-days/${training_day_id}/workout-events`,
        body
      );
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return {
    putTrainingDay,
    postTrainingDayEvent,
  };
};

export default trainingDayService;
