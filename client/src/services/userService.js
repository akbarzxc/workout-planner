import api, { setSessionToken } from "./api";

const userService = () => {
  const deleteUser = async (sessionToken, user_id) => {
    try {
      setSessionToken(sessionToken);
      const response = await api.delete(`/users/${user_id}`);
      return response.data; 
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; 
    }
  };


  return {
    deleteUser,
  };
};

export default userService;
