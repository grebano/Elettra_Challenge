// Charts.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Legend } from "chart.js/auto";
import "chartjs-adapter-date-fns";

const Charts = ({
  data,
  colors,
  unit,
  showGrid = true,
  animated = true,
  maxPoints: initialMaxPoints = 20, // Rinominato per chiarezza
}) => {
  const chartRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Definiamo la mappatura tra ciò che l'utente vede e ciò che viene effettivamente utilizzato
  const pointsMapping = {
    5: 5, // Utente vede 5, internamente usiamo 5 punti
    10: 10, // Utente vede 10, internamente usiamo 10 punti
    15: 15, // Utente vede 15, internamente usiamo 15 punti
    20: 20, // Utente vede 20, internamente usiamo 20 punti
    25: 25, // Utente vede 25, internamente usiamo 25 punti
  };

  // Stato per quello che l'utente vede
  const [displayPoints, setDisplayPoints] = useState(initialMaxPoints);
  // Calcoliamo il maxPoints effettivo da usare internamente
  const actualMaxPoints = displayPoints;

  // Utilizziamo il valore mappato per limitare i dati
  const limitedData = useMemo(() => {
    return data.slice(Math.max(0, data.length - actualMaxPoints));
  }, [data, actualMaxPoints]);

  // Opzioni disponibili per il numero di punti (ciò che l'utente vede)
  const pointOptions = Object.keys(pointsMapping).map(Number);

  // Aggiorniamo il grafico quando cambia maxPoints
  useEffect(() => {
    if (chartRef.current && chartRef.current.data && data.length > 0) {
      // Force clear and reset with exactly maxPoints
      const chart = chartRef.current;

      // Clear existing data
      chart.data.labels = [];
      chart.data.datasets[0].data = [];

      // Add the most recent actualMaxPoints points
      const recentPoints = data.slice(
        Math.max(0, data.length - actualMaxPoints)
      );

      recentPoints.forEach((point) => {
        chart.data.labels.push(point.x);
        chart.data.datasets[0].data.push(point.y);
      });

      chart.update();
    }
  }, [data, actualMaxPoints]);

  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  // Calculate min and max for better Y axis scaling
  const dataValues = limitedData.map((item) => item.y);
  const minValue = dataValues.length > 0 ? Math.min(...dataValues) * 0.9 : 0; // Add 10% padding
  const maxValue = dataValues.length > 0 ? Math.max(...dataValues) * 1.1 : 100; // Add 10% padding

  const chartData = {
    labels: limitedData.map((item) => item.x),
    datasets: [
      {
        label: "Data",
        data: limitedData.map((item) => item.y),
        borderColor: colors?.borderColor || "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: colors?.backgroundColor || "rgba(59, 130, 246, 0.1)",
        borderWidth: isHovering ? 3 : 2,
        pointRadius: 3, // Aumentato per assicurarsi che ogni punto sia visibile
        pointHoverRadius: 6,
        tension: 0.2, // Ridotto per rendere la curva meno smussata
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
          maxTicksLimit: Math.max(5, actualMaxPoints / 2), // Limitiamo il numero di etichette mostrate
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
