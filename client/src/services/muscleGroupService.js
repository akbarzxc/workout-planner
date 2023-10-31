import axios from 'axios'
const BASE_URL = 'http://localhost:3001'
//change BASE_URL later when deployed or something

const getMuscleGroups = async () => { 
  try {
  const response = await axios.get(`http://localhost:3001/musclegroups`)
  return response.data
  } catch(error) {
    console.log('Error: ', error)
  }
}
export { getMuscleGroups }