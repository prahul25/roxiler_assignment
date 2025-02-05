"use client";
import { useState, useEffect } from "react";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/transactions?search=${search}&page=${page}`
        );
        const data = await res.json();

        if (res.ok) {
          setTransactions(data.transactions || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setError(data.error || "Failed to fetch transactions.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [search, page]);

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by title, description, or price..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="bg-gray-200 px-3 py-[9px] rounded hover:bg-gray-300 transition"
          >
            ❌
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center p-4 text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border p-3">Title</th>
                  <th className="border p-3">Price</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Sold</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((txn, index) => (
                    <tr
                      key={txn.id}
                      className={`border p-3 ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-200 transition`}
                    >
                      <td className="border p-3">{txn.title}</td>
                      <td className="border p-3">${txn.price.toFixed(2)}</td>
                      <td className="border p-3">{txn.category}</td>
                      <td className="border p-3">
                        {txn.sold ? "✅ Sold" : "❌ Not Sold"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition disabled:opacity-50"
            >
              ⬅ Previous
            </button>
            <span className="text-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
