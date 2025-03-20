import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { format } from "date-fns"; 

const Charts = ({ data, title, xLabel = "Time [s]", yLabel = "Speed [kn]" }) => {
  const chartRef = useRef(null);

  // Update the chart when new data is received
  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chart = chartRef.current;

      const lastDataPoint = data[data.length - 1];

      chart.data.labels.push(lastDataPoint.x); //x axis
      chart.data.datasets[0].data.push(lastDataPoint.y); //y axis

      // Remove the first data point if the chart has more than 10 data points
      if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update();
    }
  }, [data]);
    
  // Destroy the chart when the component is unmounted
  useEffect(() => {
    const chart = chartRef.current;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []); 


  const chartData = {
    labels: data.map((item) => item.x), 
    datasets: [
      {
        label: yLabel,
        data: data.map((item) => item.y),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false  // Rimuove la legenda
      }
    },
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
        title: {
          display: true,
          text: xLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        }
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Charts;
