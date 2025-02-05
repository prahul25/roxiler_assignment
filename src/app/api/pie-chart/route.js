import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Transaction from "@/models/Transaction";

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

    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
