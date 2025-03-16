import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TemperatureDisplay from './components/temperature/TemperatureDisplay'
import Charts from './components/charts/Charts'
import Indicators from './components/status/Indicators' 
import { set } from 'date-fns'

function App() {

  // Temperature states
  const [temp, setTemp] = useState(null)
  const [tempSeries, setTempSeries] = useState([])

  // Indicator states
  const [dataReceived, setDataReceived] = useState(false);
  const [dataStopped, setDataStopped] = useState(true);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    window.electronAPI.GetMqttData((data) => {
      if (!data.data_stopped && !data.error) {
        setDataStopped(false);

        setDataReceived(true);
        setTimeout(() => setDataReceived(false), 250);

        // Update the temperature state
        if (data.temperature !== undefined) {
          setTemp(data.temperature);
          setTempSeries((prev) => [...prev, { x: new Date(), y: data.temperature }]);
        }
      } else if (data.data_stopped) {
        setDataStopped(true);
      } else if (data.error) {
        setDataError(true);
      }
    })
  }, [])

  return (
    <div className="app-container">
      <div className="temp-container">
        <TemperatureDisplay temperature={temp} unit="°C" />
      </div>
      <div className="charts-container">
        <Charts data={tempSeries} />
      </div>
      <div className="indicators-container">
        <Indicators
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
        />
      </div>
    </div>
  );
}

export default App
