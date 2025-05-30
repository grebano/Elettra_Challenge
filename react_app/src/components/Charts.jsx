import React, { useState } from "react";
import Charts from "./charts/Charts";
import Indicators from "./status/Indicators";

function ChartContainer({
  temp1Series,
  temp2Series,
  temp3Series,
  temp4Series,
  temp5Series,
  speedSeries,
  dataReceived,
  dataStopped,
  dataError,
  mqttConnectionStatus,
}) {
  const [activeTab, setActiveTab] = useState("all");

  // Define chart configurations for each series
  const chartConfigs = [
    {
      id: "temp1",
      label: "Temperature 1",
      data: temp1Series,
      unit: "°C",
      category: "temperature",
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      id: "temp2",
      label: "Temperature 2",
      data: temp2Series,
      unit: "°C",
      category: "temperature",
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    {
      id: "temp3",
      label: "Temperature 3",
      data: temp3Series,
      unit: "°C",
      category: "temperature",
      borderColor: "#FFCE56",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
    },
    {
      id: "temp4",
      label: "Temperature 4",
      data: temp4Series,
      unit: "°C",
      category: "temperature",
      borderColor: "#4BC0C0",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
    {
      id: "temp5",
      label: "Temperature 5",
      data: temp5Series,
      unit: "°C",
      category: "temperature",
      borderColor: "#9966FF",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
    },
    {
      id: "speed",
      label: "Speed",
      data: speedSeries,
      unit: "kn",
      category: "performance",
      borderColor: "#FF9F40",
      backgroundColor: "rgba(255, 159, 64, 0.2)",
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
    <div className="p-6 bg-gray-50 rounded-xl shadow-md pb-24">
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
          mqttConnectionStatus={mqttConnectionStatus}
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
