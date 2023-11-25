import api, { setSessionToken } from "./api";

const movementService = () => {
  const getMovements = async (sessionToken) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.get(`/movements`);
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return {
    getMovements,
  };
};

export default movementService;
