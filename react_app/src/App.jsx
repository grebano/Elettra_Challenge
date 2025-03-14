import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TemperatureDisplay from './components/temperature/TemperatureDisplay'

function App() {

  const [temp, setTemp] = useState(null)

  useEffect(() => {
    window.electronAPI.GetMqttData((data) => {
      if (data.temp !== undefined) {
        setTemp(data.temp);
      }
    })
  }, [])

  return (
    <>
      <TemperatureDisplay temperature={temp} unit="°C" />
    </>
  )
}

export default App
