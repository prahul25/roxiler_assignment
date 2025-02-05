import Transaction from "@/models/Transaction";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const perPage = parseInt(searchParams.get("perPage")) || 10;

    let query = {};
    if (search) {
      const priceValue = parseFloat(search);

      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        ...(isNaN(priceValue) ? [] : [{ price: priceValue }]),
      ];
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalCount = await Transaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
      totalTransactions: totalCount,
    });
  } catch (error) {
    console.log(error, "Error message");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
