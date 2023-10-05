import axios from 'axios'

const getNames = async () => { 
  try {
  const response = await axios.get('http://localhost:3001/test')
  return response.data
  } catch(error) {
    console.log('Error: ', error)
}
}
export default { getNames }