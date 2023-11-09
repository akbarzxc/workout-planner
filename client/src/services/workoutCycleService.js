import api, { setSessionToken } from './api';

const workoutCycleService = () => {
  const getWorkoutCycle = async (sessionToken, userID) => { 
    try {
    setSessionToken(sessionToken)
    const response = await api.get(`/workoutplan/cycle/${userID}`);
    return response.data

    } catch(error) {
      console.log('Error: ', error)
    }
  }

return { 
  getWorkoutCycle,
  }
};

export default workoutCycleService 