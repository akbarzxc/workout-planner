import React, { useEffect, useState } from 'react'
import testService from './services/testService'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    testService.getNames().then(names => {
      setUsers(names)
      }
    )
  }, [])


return (
  <div>
    <h1>Workout Planner</h1>
    <h2>Data from API:</h2>
    <ul>
      {users?.map((name) => (
        <li key={name.id}>{name.name}</li>
      ))}
    </ul>
  </div>
)

}

export default App
