import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { format } from "date-fns"; 

const Charts = ({ data }) => {
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
        label: "Temperature",
        data: data.map((item) => item.y),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
          tooltipFormat: "mm:ss",
          displayFormats: {
            second: "mm:ss",
          },
        },
        title: {
          display: true,
          text: "Time (mm:ss)",
        },
      },
    },
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default Charts;
