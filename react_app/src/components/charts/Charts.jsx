// Charts.jsx
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Legend } from "chart.js/auto";
import "chartjs-adapter-date-fns";

const Charts = ({ data, colors, unit, showGrid = true, animated = true }) => {
  const chartRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chart = chartRef.current;
      const lastDataPoint = data[data.length - 1];

      chart.data.labels.push(lastDataPoint.x);
      chart.data.datasets[0].data.push(lastDataPoint.y);

      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update("none"); // Use 'none' mode for better performance
    }
  }, [data]);

  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  // Calculate min and max for better Y axis scaling
  const dataValues = data.map((item) => item.y);
  const minValue = Math.min(...dataValues) * 0.9; // Add 10% padding
  const maxValue = Math.max(...dataValues) * 1.1; // Add 10% padding

  const chartData = {
    labels: data.map((item) => item.x),
    datasets: [
      {
        label: "Data",
        data: data.map((item) => item.y),
        borderColor: colors?.borderColor || "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: colors?.backgroundColor || "rgba(59, 130, 246, 0.1)",
        borderWidth: isHovering ? 3 : 2,
        pointRadius: isHovering ? 4 : 2,
        pointHoverRadius: 6,
        tension: 0.4, // Add smooth curve
        fill: true,
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
    <div
      className="w-full h-64 transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Charts;
