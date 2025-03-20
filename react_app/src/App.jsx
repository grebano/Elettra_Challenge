import { useState, useEffect } from 'react'
import './App.css'
import TemperatureDisplay from './components/temperature/TemperatureDisplay'
import Charts from './components/charts/Charts'
import Indicators from './components/status/Indicators' 
import Map from './components/map/Map'
import markers from './assets/map/fixed-markers.json'

function App() {
  console.log("Rendering App component"); // Log per debug

  // Temperature states
  const [temp, setTemp] = useState(null)
  const [tempSeries, setTempSeries] = useState([])

  // New metrics states
  const [batteryVolt, setBatteryVolt] = useState(null)
  const [batteryPercent, setBatteryPercent] = useState(null)
  const [inverterTemp, setInverterTemp] = useState(null)
  const [energyTorque, setEnergyTorque] = useState(null)
  const [motorCurrent, setMotorCurrent] = useState(null)

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
    console.log("App component mounted or updated"); // Log per debug
    try {
      window.electronAPI.GetMqttData((data) => {
        console.log("Received data:", data); // Log per debug
        if (!data.data_stopped && !data.error) {
          setDataStopped(false);

          setDataReceived(true);
          setTimeout(() => setDataReceived(false), 250);

          // Update the temperature state
          if (data.temperature !== undefined) {
            setTemp(data.temperature);
            setTempSeries((prev) => [...prev, { x: new Date(), y: data.temperature }]);
          }
          
          // Update the new metric states
          if (data.batteryVolt !== undefined) setBatteryVolt(data.batteryVolt);
          if (data.batteryPercent !== undefined) setBatteryPercent(data.batteryPercent);
          if (data.inverterTemp !== undefined) setInverterTemp(data.inverterTemp);
          if (data.energyTorque !== undefined) setEnergyTorque(data.energyTorque);
          if (data.motorCurrent !== undefined) setMotorCurrent(data.motorCurrent);
          
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
      });
    } catch (error) {
      console.error("Error while fetching MQTT data:", error);
      setDataError(true);
    }
  }, []);

  return (

      <div className="app-container">
        <div className="temp-container">
          <div className="metrics-grid">
            <TemperatureDisplay temperature={temp} unit="°C" label="Temperature" />
            <TemperatureDisplay temperature={batteryVolt} unit="V" label="Battery Voltage" />
            <TemperatureDisplay temperature={batteryPercent} unit="%" label="Battery Level" />
            <TemperatureDisplay temperature={inverterTemp} unit="°C" label="Inverter Temperature" />
            <TemperatureDisplay temperature={energyTorque} unit="Nm" label="Energy Torque" />
            <TemperatureDisplay temperature={motorCurrent} unit="A" label="Motor Current" />
          </div>
        </div>
        <div className="py-3"/>
        <div className="charts-grid">
          <div className="chart-row">
            <div className="chart-wrapper">
              <Charts data={tempSeries.slice(0, Math.min(10, tempSeries.length)) || []} 
              title="Instant Speed" 
              yLabel="Speed (km/h)"
              xLabel="Time (s)"
             />
            </div>
            <div className="chart-wrapper">
              <Charts data={tempSeries.slice(10, Math.min(20, tempSeries.length)) || []} title="Engine RPM" 
               yLabel="RPM"
               xLabel="Time (s)"/>
            </div>
          </div>
          <div className="chart-row">
            <div className="chart-wrapper">
              <Charts data={tempSeries.slice(20, Math.min(30, tempSeries.length)) || []} title="Engine Current" 
               yLabel="Current (A)"
               xLabel="Time (s)"/>
            </div>
            <div className="chart-wrapper">
              <Charts data={tempSeries.slice(30, Math.min(40, tempSeries.length)) || []} title="Engine Torque" 
               yLabel="Torque (Nm)"
               xLabel="Time (s)"/>
            </div>
          </div>
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

export default App;
