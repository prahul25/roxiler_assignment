"use client";
import { useState } from "react";
import TransactionsTable from "@/components/TransactionsTable";
import StatisticsBox from "@/components/StatisticsBox";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [showBarChart, setShowBarChart] = useState(true);
  return (
    <main className="container mx-auto p-6">
      <div className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center z-50">
  <h1 className="text-2xl font-bold text-gray-800">📊 Transactions Dashboard</h1>
  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    className="border border-gray-300 p-2 rounded-md shadow-sm bg-white focus:outline-none focus:ring focus:ring-blue-300 transition"
  >
    {[
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ].map((month) => (
      <option key={month} value={month}>{month}</option>
    ))}
  </select>
</div>


      <div className="mb-6 mt-12">
        <StatisticsBox selectedMonth={selectedMonth} />
      </div>

      <div>
        <div>
          <TransactionsTable/>
        </div>
        <div className="p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center">
          <button
            onClick={() => setShowBarChart(!showBarChart)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            {showBarChart ? "📈 Show Pie Chart" : "📊 Show Bar Chart"}
          </button>

          <div className="w-full">{showBarChart ? <BarChart selectedMonth={selectedMonth} /> : <PieChart selectedMonth={selectedMonth} />}</div>
        </div>

      </div>
    </main>
  );
}
