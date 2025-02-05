import Transaction from "@/models/Transaction";
import connectDB from "@/utils/db";
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

    return NextResponse.json({
      totalAmount: totalSales[0]?.totalAmount || 0,
      totalSold: totalSales[0]?.totalSold || 0,
      totalNotSold,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
