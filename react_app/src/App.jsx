import React, { use, useEffect, useState } from "react";
import "./App.css";
import Map from "./components/Map";
import Live from "./components/Live";
import Charts from "./components/Charts";
import Logs from "./components/Logs";
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
  const [mqttConnectionStatus, setMqttConnectionStatus] = useState(true);

  //Event states
  const [events, setEvents] = useState([]);

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
    try {
      window.electronAPI.GetMqttData((data) => {
        console.log("Received data:", data); // Log per debug

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

        if (data.latitude !== undefined && data.longitude !== undefined) {
          const newMarker = {
            position: [data.latitude, data.longitude],
            popupText: new Date().toUTCString(),
            color: "green",
          };
          setLastMarker(newMarker);
        }
      });

      window.electronAPI.GetEvents((event) => {
        console.log("Received event:", event); // Log per debug
        setEvents((prevEvents) => {
          const newEvents = [...prevEvents, event];
          if (newEvents.length > 50) {
            newEvents.shift(); // Remove the oldest event if more than 50
          }
          return newEvents;
        });

        if (event.code) {
          switch (event.code) {
            case "mqtt-stopped":
              setDataStopped(true);
              break;
            case "mqtt-data-error":
              setDataError(true);
              setTimeout(() => {
                setDataError(false);
              }, 5000);
              break;
            case "mqtt-closed":
            case "mqtt-offline":
            case "mqtt-reconnect":
            case "mqtt-error":
              setMqttConnectionStatus(false);
              break;
            case "mqtt-connected":
              setMqttConnectionStatus(true);
              break;
            default:
              break;
          }
        }
      });
    } catch (error) {
      console.error("Error while fetching MQTT data:", error);
      setDataError(true);
      setTimeout(() => {
        setDataError(false);
      }, 5000);
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
          mqttConnectionStatus={mqttConnectionStatus}
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
          mqttConnectionStatus={mqttConnectionStatus}
        />
      );
    case "#/map":
    case "#\\map":
      return <Map lastMarker={lastMarker} fixedMarkers={fixedMarkers} />;
    case "#/logs":
    case "#\\logs":
      return <Logs events={events} />;
    default:
      return (
        <Live
          temp={temp}
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
          mqttConnectionStatus={mqttConnectionStatus}
        />
      );
  }
}

export default App;
