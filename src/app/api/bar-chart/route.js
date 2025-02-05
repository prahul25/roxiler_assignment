import connectDB from "@/utils/db";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
        const month = searchParams.get("month");
    
        if (!month) {
          return NextResponse.json({ error: "Month is required" }, { status: 400 });
        }
    const startDate = new Date(`${month} 1, 2021`);
    const endDate = new Date(`${month} 31, 2022`);
  
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
      { range: "901-above", min: 901, max: Infinity }
    ];
  
    const result = {};
    for (let range of priceRanges) {
      result[range.range] = await Transaction.countDocuments({
        price: { $gte: range.min, $lte: range.max },
        dateOfSale: { $gte: startDate, $lte: endDate }
      });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
