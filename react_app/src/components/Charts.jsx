import React, { useState } from "react";
import Charts from "./charts/Charts";
import Indicators from "./status/Indicators";

function ChartContainer({
  tempSeries,
  batteryVoltSeries,
  batteryPercentSeries,
  inverterTempSeries,
  energyTorqueSeries,
  motorCurrentSeries,
  dataReceived,
  dataStopped,
  dataError,
}) {
  const [activeTab, setActiveTab] = useState("all");

  // Define chart configurations for each series
  const chartConfigs = [
    {
      id: "temp",
      label: "Boat Speed",
      data: tempSeries || [],
      borderColor: "rgba(239, 68, 68, 1)", // Red
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      unit: "kn",
      category: "performance",
    },
    {
      id: "batteryVolt",
      label: "Battery Voltage",
      data: batteryVoltSeries || [],
      borderColor: "rgba(16, 185, 129, 1)", // Green
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      unit: "V",
      category: "power",
    },
    {
      id: "batteryPercent",
      label: "Battery Percentage",
      data: batteryPercentSeries || [],
      borderColor: "rgba(14, 165, 233, 1)", // Sky Blue
      backgroundColor: "rgba(14, 165, 233, 0.1)",
      unit: "%",
      category: "power",
    },
    {
      id: "inverterTemp",
      label: "Inverter Temperature",
      data: inverterTempSeries || [],
      borderColor: "rgba(168, 85, 247, 1)", // Purple
      backgroundColor: "rgba(168, 85, 247, 0.1)",
      unit: "°C",
      category: "temperature",
    },
    {
      id: "energyTorque",
      label: "Energy Torque",
      data: energyTorqueSeries || [],
      borderColor: "rgba(245, 158, 11, 1)", // Amber
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      unit: "Nm",
      category: "performance",
    },
    {
      id: "motorCurrent",
      label: "Motor Current",
      data: motorCurrentSeries || [],
      borderColor: "rgba(75, 85, 99, 1)", // Gray
      backgroundColor: "rgba(75, 85, 99, 0.1)",
      unit: "A",
      category: "power",
    },
  ];

  // Filter charts based on active tab
  const getFilteredCharts = () => {
    if (activeTab === "all") return chartConfigs;
    return chartConfigs.filter((config) => config.category === activeTab);
  };

  // Get last value for a series
  const getLastValue = (data) => {
    if (!data || data.length === 0) return "--";
    return data[data.length - 1].y.toFixed(1);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Historical Data
        </h2>

        {/* Category Tabs */}
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label="All"
          />
          <TabButton
            active={activeTab === "performance"}
            onClick={() => setActiveTab("performance")}
            label="Performance"
          />
          <TabButton
            active={activeTab === "power"}
            onClick={() => setActiveTab("power")}
            label="Power"
          />
          <TabButton
            active={activeTab === "temperature"}
            onClick={() => setActiveTab("temperature")}
            label="Temperature"
          />
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredCharts().map((config) => (
          <div
            key={config.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-800">
                {config.label}
              </h3>
              <div className="flex items-baseline">
                <span
                  className="text-xl font-bold"
                  style={{ color: config.borderColor }}
                >
                  {getLastValue(config.data)}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  {config.unit}
                </span>
              </div>
            </div>
            <div className="p-4">
              <Charts
                data={config.data}
                colors={{
                  borderColor: config.borderColor,
                  backgroundColor: config.backgroundColor,
                }}
                unit={config.unit}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Status Indicators Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg py-3 px-4 border-t border-gray-200 flex justify-center z-10">
        <Indicators
          dataReceived={dataReceived}
          dataStopped={dataStopped}
          dataError={dataError}
        />
      </div>
    </div>
  );
}

// Tab Button Component
const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      active
        ? "bg-blue-500 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

export default ChartContainer;
