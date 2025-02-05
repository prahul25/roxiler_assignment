import connectDB from "@/utils/db";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const { month } = req.query;
  // console.log(month, "month from ");
  const startDate = new Date(`${month} 1, 2023`);
  const endDate = new Date(`${month} 31, 2023`);

  const transactions = await Transaction.find({
    dateOfSale: { $gte: startDate, $lte: endDate },
  });

  const totalSales = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$price" },
        totalSold: { $sum: 1 },
      },
    },
  ]);

  const totalNotSold = await Transaction.countDocuments({
    sold: false,
    dateOfSale: { $gte: startDate, $lte: endDate },
  });

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: Infinity },
  ];

  const barChartData = {};
  for (let range of priceRanges) {
    barChartData[range.range] = await Transaction.countDocuments({
      price: { $gte: range.min, $lte: range.max },
      dateOfSale: { $gte: startDate, $lte: endDate },
    });
  }

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  return NextResponse.json({
    transactions,
    statistics: {
      totalAmount: totalSales[0]?.totalAmount || 0,
      totalSold: totalSales[0]?.totalSold || 0,
      totalNotSold,
    },
    barChartData,
    pieChartData: categories,
  });
}
