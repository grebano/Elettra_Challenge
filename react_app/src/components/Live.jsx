import React, { use, useEffect, useState } from "react";
import DashUnit from "./dash-unit/DashUnit";
import Indicators from "./status/Indicators";

// Import some icons (assuming you're using a library like heroicons or lucide)
// Replace these with actual imports from your icon library
const BatteryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="6" width="18" height="12" rx="2" />
    <line x1="23" y1="13" x2="23" y2="11" />
  </svg>
);
const SpeedometerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
  </svg>
);
const TemperatureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
);
const ElectricIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const RotateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
const PlayPauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v6h6" />
    <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
  </svg>
);

function Live({
  temp,
  batteryVolt,
  batteryPercent,
  inverterTemp,
  energyTorque,
  motorCurrent,
  motorRPM,
  bmsSystemTemp,
  bmsBatteryTemp1,
  bmsBatteryTemp2,
  dataReceived,
  dataStopped,
  dataError,
  mqttConnectionStatus,
}) {
  // Get time for the dashboard
  const [currentTime, setCurrentTime] = useState(new Date());
  const [grafanaRunning, setGrafanaRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleStartStop = () => {
    // Logic to start/stop Grafana backend
    if (grafanaRunning) {
      window.electronAPI.StopGrafana();
    } else {
      window.electronAPI.StartGrafana();
    }
    setGrafanaRunning(!grafanaRunning);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-white min-h-screen flex flex-col items-center">
      {/* Header with time and title */}
      <div className="mb-8 w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
          Elettra Dashboard
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
        </h1>
        <div className="mt-4 sm:mt-0 flex items-center">
          {/* Grafana Control Buttons */}
          <div className="flex mr-4">
            <button
              onClick={handleStartStop}
              className={`mr-2 px-4 py-2 rounded-lg shadow-md flex items-center transition-all ${
                grafanaRunning
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <PlayPauseIcon />
              <span className="ml-2">
                {grafanaRunning ? "Stop Grafana" : "Start Grafana"}
              </span>
            </button>
          </div>
          {/* Time Display */}
          <div className="bg-white py-2 px-4 rounded-lg shadow-md border border-gray-100">
            <p className="text-gray-500 text-sm">System Time</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Metrics Section with card groups */}
      <div className="w-full max-w-6xl mb-20">
        {/* Top priority group */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 px-1">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Speed Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-20">
                <SpeedometerIcon />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Boat Speed
              </p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{temp || "--"}</span>
                <span className="text-xl ml-1">kn</span>
              </div>
            </div>

            {/* Battery Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-20">
                <BatteryIcon />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Power Status
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-green-100 text-xs">LEVEL</div>
                  <div className="text-3xl font-bold">
                    {batteryPercent || "--"}%
                  </div>
                </div>
                <div>
                  <div className="text-green-100 text-xs">VOLTAGE</div>
                  <div className="text-3xl font-bold">
                    {batteryVolt || "--"}
                    <span className="text-xl ml-0.5">V</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/20 h-2 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full"
                  style={{ width: `${batteryPercent || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Regular metrics */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3 px-1">
          System Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <DashUnit
            datum={inverterTemp}
            unit="°C"
            label="Inverter Temperature"
            icon={<TemperatureIcon />}
          />
          <DashUnit
            datum={energyTorque || motorCurrent}
            unit="Nm"
            label="Energy Torque"
            icon={<ElectricIcon />}
          />
          <DashUnit
            datum={motorCurrent}
            unit="A"
            label="Motor Current"
            icon={<ElectricIcon />}
          />
          <DashUnit
            datum={motorRPM || motorCurrent}
            unit=""
            label="Motor RPM"
            icon={<RotateIcon />}
          />
          <DashUnit
            datum={bmsSystemTemp || motorCurrent}
            unit="°C"
            label="BMS System Temp"
            icon={<TemperatureIcon />}
          />
          <DashUnit
            datum={bmsBatteryTemp1 || motorCurrent}
            unit="°C"
            label="BMS Battery Temp 1"
            icon={<TemperatureIcon />}
          />
          <DashUnit
            datum={bmsBatteryTemp2 || motorCurrent}
            unit="°C"
            label="BMS Battery Temp 2"
            icon={<TemperatureIcon />}
          />
          <DashUnit
            datum={null}
            unit="W"
            label="Power Consumption"
            icon={<ElectricIcon />}
          />
        </div>
      </div>

      {/* Status Indicators Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg py-3 px-4 border-t border-gray-200 flex justify-center z-10">
        <Indicators
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
          mqttConnectionStatus={mqttConnectionStatus}
          grafanaRunning={grafanaRunning}
        />
      </div>
    </div>
  );
}

export default Live;
