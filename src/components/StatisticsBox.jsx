"use client";
import { useEffect, useState } from "react";

const StatisticsBox = ({ selectedMonth }) => {
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalSold: 0,
    totalNotSold: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/statistics?month=${selectedMonth}`);
        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          setError("Failed to load statistics.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    };

    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-lg shadow-lg bg-white">
      {loading ? (
        <div className="col-span-3 text-center p-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="col-span-3 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="p-6 bg-blue-100 rounded-lg shadow-md flex flex-col items-center">
            <div className="text-4xl text-blue-600 font-bold">💰</div>
            <h2 className="text-xl font-semibold mt-2">Total Sales</h2>
            <p className="text-lg font-bold text-blue-700">
              ${stats.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-green-100 rounded-lg shadow-md flex flex-col items-center">
            <div className="text-4xl text-green-600 font-bold">✅</div>
            <h2 className="text-xl font-semibold mt-2">Total Sold</h2>
            <p className="text-lg font-bold text-green-700">
              {stats.totalSold} items
            </p>
          </div>

          <div className="p-6 bg-red-100 rounded-lg shadow-md flex flex-col items-center">
            <div className="text-4xl text-red-600 font-bold">❌</div>
            <h2 className="text-xl font-semibold mt-2">Total Not Sold</h2>
            <p className="text-lg font-bold text-red-700">
              {stats.totalNotSold} items
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsBox;
