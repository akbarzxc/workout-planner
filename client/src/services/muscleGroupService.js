import api, { setSessionToken } from './api';

const muscleGroupService = () => {
  const getMuscleGroups = async (sessionToken) => { 
    try {
    setSessionToken(sessionToken)
    const response = await api.get(`/musclegroups`);
    return response.data

    } catch(error) {
      console.log('Error: ', error)
    }
  }

return { 
  getMuscleGroups,
  }
};

export default muscleGroupService 