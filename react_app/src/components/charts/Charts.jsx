// Charts.jsx
import React, { useRef, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Legend } from "chart.js/auto";
import "chartjs-adapter-date-fns";

const Charts = ({
  data,
  colors,
  unit,
  showGrid = true,
  animated = true,
  maxPoints: initialMaxPoints = 20,
}) => {
  const chartRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Available options for the number of points to display
  const pointOptions = [5, 10, 15, 20, 25];

  // State for the number of points to display
  const [displayPoints, setDisplayPoints] = useState(initialMaxPoints);

  // Limit the data to the selected number of points
  const limitedData = useMemo(() => {
    return data.slice(Math.max(0, data.length - displayPoints));
  }, [data, displayPoints]);

  // Calculate min and max for better Y axis scaling
  const dataValues = limitedData.map((item) => item.y);
  const minValue = dataValues.length > 0 ? Math.min(...dataValues) * 0.9 : 0; // 10% padding
  const maxValue = dataValues.length > 0 ? Math.max(...dataValues) * 1.1 : 100; // 10% padding

  const chartData = {
    labels: limitedData.map((item) => item.x),
    datasets: [
      {
        label: "Data",
        data: limitedData.map((item) => item.y),
        borderColor: colors?.borderColor || "rgba(59, 130, 246, 1)",
        backgroundColor: colors?.backgroundColor || "rgba(59, 130, 246, 0.1)",
        borderWidth: isHovering ? 3 : 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.2,
        fill: true,
        pointBackgroundColor: colors?.borderColor || "rgba(59, 130, 246, 1)",
        showLine: true,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animated
      ? {
          duration: 800,
          easing: "easeOutQuart",
        }
      : false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
          tooltipFormat: "HH:mm:ss",
          displayFormats: {
            second: "HH:mm:ss",
          },
        },
        grid: {
          display: showGrid,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "rgba(107, 114, 128, 0.8)",
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: Math.max(5, displayPoints / 2),
        },
        title: {
          display: false,
        },
      },
      y: {
        min: isFinite(minValue) ? minValue : undefined,
        max: isFinite(maxValue) ? maxValue : undefined,
        grid: {
          display: showGrid,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "rgba(107, 114, 128, 0.8)",
          font: {
            size: 10,
          },
          callback: function (value) {
            return value + (unit ? ` ${unit}` : "");
          },
        },
        title: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1F2937",
        bodyColor: "#4B5563",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y}${unit ? ` ${unit}` : ""}`;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="w-full transition-all duration-300">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <label htmlFor="pointsSelector" className="text-xs text-gray-600">
            Number of points:
          </label>
          <select
            id="pointsSelector"
            value={displayPoints}
            onChange={(e) => setDisplayPoints(Number(e.target.value))}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            {pointOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="w-full h-64 transition-all duration-300"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Charts;