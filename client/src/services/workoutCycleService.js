import api, { setSessionToken } from './api';

const workoutCycleService = () => {
  const getWorkoutCycle = async (sessionToken, userID) => { 
    try {
    setSessionToken(sessionToken)
    const response = await api.post('/workoutplan/cycle', {
        userID: userID
    });
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