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
  const [temp1, setTemp1] = useState(null);
  const [temp1Series, setTemp1Series] = useState([]);

  const [temp2, setTemp2] = useState(null);
  const [temp2Series, setTemp2Series] = useState([]);

  const [temp3, setTemp3] = useState(null);
  const [temp3Series, setTemp3Series] = useState([]);

  const [temp4, setTemp4] = useState(null);
  const [temp4Series, setTemp4Series] = useState([]);

  const [temp5, setTemp5] = useState(null);
  const [temp5Series, setTemp5Series] = useState([]);

  // Speed states
  const [speed, setSpeed] = useState(null);
  const [speedSeries, setSpeedSeries] = useState([]);

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
        if (data.temperature1 !== undefined) {
          setTemp1(data.temperature1);
          setTemp1Series((prev) => [
            ...prev,
            { x: new Date(), y: data.temperature1 },
          ]);
        }

        if (data.temperature2 !== undefined) {
          setTemp2(data.temperature2);
          setTemp2Series((prev) => [
            ...prev,
            { x: new Date(), y: data.temperature2 },
          ]);
        }

        if (data.temperature3 !== undefined) {
          setTemp3(data.temperature3);
          setTemp3Series((prev) => [
            ...prev,
            { x: new Date(), y: data.temperature3 },
          ]);
        }

        if (data.temperature4 !== undefined) {
          setTemp4(data.temperature4);
          setTemp4Series((prev) => [
            ...prev,
            { x: new Date(), y: data.temperature4 },
          ]);
        }

        if (data.temperature5 !== undefined) {
          setTemp5(data.temperature5);
          setTemp5Series((prev) => [
            ...prev,
            { x: new Date(), y: data.temperature5 },
          ]);
        }

        // Update speed state
        if (data.speed !== undefined) {
          setSpeed(parseFloat((data.speed / 1.852).toFixed(2)));
          setSpeedSeries((prev) => [
            ...prev,
            { x: new Date(), y: parseFloat((data.speed / 1.852).toFixed(2)) },
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
          temp1={temp1}
          temp2={temp2}
          temp3={temp3}
          temp4={temp4}
          temp5={temp5}
          speed={speed}
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
          temp1Series={temp1Series}
          temp2Series={temp2Series}
          temp3Series={temp3Series}
          temp4Series={temp4Series}
          temp5Series={temp5Series}
          speedSeries={speedSeries}
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
          temp1={temp1}
          temp2={temp2}
          temp3={temp3}
          temp4={temp4}
          temp5={temp5}
          speed={speed}
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
          mqttConnectionStatus={mqttConnectionStatus}
        />
      );
  }
}

export default App;
