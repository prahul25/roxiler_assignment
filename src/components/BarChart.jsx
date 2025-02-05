"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError("");
      setChartData(null); 

      try {
        const res = await fetch(`/api/bar-chart?month=${selectedMonth}`);
        const data = await res.json();

        if (res.ok && Object.keys(data).length > 0) {
          setChartData({
            labels: Object.keys(data),
            datasets: [
              {
                label: "Number of Items",
                data: Object.values(data),
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                ],
                borderWidth: 1,
                borderColor: "#fff",
                hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
              },
            ],
          });
        } else {
          setError("No data available for the selected month.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    };

    fetchChartData();
  }, [selectedMonth]);

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">📊 Price Range Distribution</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading chart...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  x: {
                    ticks: { color: "#333" },
                    grid: { display: false },
                  },
                  y: {
                    ticks: { color: "#333" },
                    grid: { color: "rgba(200, 200, 200, 0.3)" },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BarChart;
