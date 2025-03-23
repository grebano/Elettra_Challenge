import React, { useEffect, useState } from "react";
import "./App.css";
import Map from "./components/Map";
import Live from "./components/Live";
import Charts from "./components/Charts";
import markers from "./assets/map/fixed-markers.json";

function App({ windowName }) {
  console.log("Rendering App component"); // Log per debug

  // Temperature states
  const [temp, setTemp] = useState(null);
  const [tempSeries, setTempSeries] = useState([]);

  // Battery voltage states
  const [batteryVolt, setBatteryVolt] = useState(null);
  const [batteryVoltSeries, setBatteryVoltSeries] = useState([]);

  // Battery percentage states
  const [batteryPercent, setBatteryPercent] = useState(null);
  const [batteryPercentSeries, setBatteryPercentSeries] = useState([]);

  // Inverter temperature states
  const [inverterTemp, setInverterTemp] = useState(null);
  const [inverterTempSeries, setInverterTempSeries] = useState([]);

  //Energy torque states
  const [energyTorque, setEnergyTorque] = useState(null);
  const [energyTorqueSeries, setEnergyTorqueSeries] = useState([]);

  // Motor current states
  const [motorCurrent, setMotorCurrent] = useState(null);
  const [motorCurrentSeries, setMotorCurrentSeries] = useState([]);

  // Indicator states
  const [dataReceived, setDataReceived] = useState(false);
  const [dataStopped, setDataStopped] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [mqttConnectionStatus, setMqttConnectionStatus] = useState(false);

  // Map markers
  const [fixedMarkers] = useState(
    markers.fixed_markers.map((marker) => {
      return {
        position: marker[1],
        popupText: marker[0],
        color: marker[2],
      };
    })
  );
  const [lastMarker, setLastMarker] = useState(null);

  // Get data from the main process
  useEffect(() => {
    console.log("App component mounted or updated"); // Log per debug
    try {
      window.electronAPI.GetMqttData((data) => {
        console.log("Received data:", data); // Log per debug
        if (!data.data_stopped && !data.error && !data.offline) {
          // Handle normal status
          setMqttConnectionStatus(true);
          setDataStopped(false);

          setDataReceived(true);
          setTimeout(() => setDataReceived(false), 250);

          // Update the temperature state
          if (data.temperature !== undefined) {
            setTemp(data.temperature);
            setTempSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.temperature },
            ]);
          }

          // Update the new metric states
          if (data.battery_voltage !== undefined) {
            setBatteryVolt(data.battery_voltage);
            setBatteryVoltSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.battery_voltage },
            ]);
          }
          if (data.battery_percentage !== undefined) {
            setBatteryPercent(data.battery_percentage);
            setBatteryPercentSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.battery_percentage },
            ]);
          }
          if (data.inverter_temperature !== undefined) {
            setInverterTemp(data.inverter_temperature);
            setInverterTempSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.inverter_temperature },
            ]);
          }
          if (data.energy_torque !== undefined) {
            setEnergyTorque(data.energy_torque);
            setEnergyTorqueSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.energy_torque },
            ]);
          }
          if (data.motor_current !== undefined) {
            setMotorCurrent(data.motor_current);
            setMotorCurrentSeries((prev) => [
              ...prev,
              { x: new Date(), y: data.motor_current },
            ]);
          }

          if (data.lat !== undefined && data.lon !== undefined) {
            const newMarker = {
              position: [data.lat, data.lon],
              popupText: new Date().toUTCString(),
            };
            setLastMarker(newMarker);
          }
        } else {
          // Handle errors status
          setDataError(data.error);

          // Handle offline status
          setMqttConnectionStatus(!data.offline);

          // Handle data stopped status
          setDataStopped(data.data_stopped);
        }
      });
    } catch (error) {
      console.error("Error while fetching MQTT data:", error);
      setDataError(true);
    }
  }, []);

  switch (windowName) {
    case "#/live":
    case "#\\live":
      return (
        <Live
          temp={temp}
          batteryVolt={batteryVolt}
          batteryPercent={batteryPercent}
          inverterTemp={inverterTemp}
          energyTorque={energyTorque}
          motorCurrent={motorCurrent}
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
        />
      );
    case "#/charts":
    case "#\\charts":
      return (
        <Charts
          tempSeries={tempSeries}
          batteryVoltSeries={batteryVoltSeries}
          batteryPercentSeries={batteryPercentSeries}
          inverterTempSeries={inverterTempSeries}
          energyTorqueSeries={energyTorqueSeries}
          motorCurrentSeries={motorCurrentSeries}
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
        />
      );
    case "#/map":
    case "#\\map":
      return <Map lastMarker={lastMarker} fixedMarkers={fixedMarkers} />;
    default:
      return (
        <Live
          temp={temp}
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
        />
      );
  }
}

export default App;
