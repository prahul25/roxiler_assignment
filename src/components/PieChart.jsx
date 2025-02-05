"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/pie-chart?month=${selectedMonth}`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
          setChartData({
            labels: data.map((item) => item._id),
            datasets: [
              {
                label: "Items per Category",
                data: data.map((item) => item.count),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"],
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
      <h2 className="text-lg font-bold mb-4 text-center">📊 Category-wise Distribution</h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
