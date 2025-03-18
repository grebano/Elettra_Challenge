import { useState, useEffect } from 'react'
import './App.css'
import TemperatureDisplay from './components/temperature/TemperatureDisplay'
import Charts from './components/charts/Charts'
import Indicators from './components/status/Indicators' 
import Map from './components/map/Map'
import markers from './assets/map/fixed-markers.json'

function App() {

  // Temperature states
  const [temp, setTemp] = useState(null)
  const [tempSeries, setTempSeries] = useState([])

  // Indicator states
  const [dataReceived, setDataReceived] = useState(false);
  const [dataStopped, setDataStopped] = useState(true);
  const [dataError, setDataError] = useState(false);

  // Map markers
  const [fixedMarkers] = useState(
    markers.fixed_markers.map((marker) => {
      return {
        position: marker[1],
        popupText: marker[0],
        color: marker[2],
      }
    })
  );
  const [lastMarker, setLastMarker] = useState(null);

  // Get data from the main process
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
        
        if (data.lat !== undefined && data.lon !== undefined) {
          const newMarker = {
            position: [data.lat, data.lon],
            popupText: new Date().toUTCString(),
          };
          setLastMarker(newMarker);
          
        }
      } else if (data.data_stopped) {
        setDataStopped(true);
      } else if (data.error) {
        setDataError(true);
      }
    })
  }, []);

  return (
    <div className="app-container">
      <div className="temp-container">
        <TemperatureDisplay temperature={temp} unit="°C" />
      </div>
      <div className="py-3"/>
      <div className="charts-container">
        <Charts data={tempSeries} />
      </div>
      <div className="py-3"/>
      <div className="map-container">
        <Map lastMarker={lastMarker} fixedMarkers={fixedMarkers}/>
      </div>
      <div className="py-3"/>
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
