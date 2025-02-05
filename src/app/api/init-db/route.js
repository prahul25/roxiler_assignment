import Transaction from "@/models/Transaction";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const response = await fetch(
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
  );
  const data = await response.json();

  await Transaction.deleteMany();
  await Transaction.insertMany(data);

  return NextResponse.json({
    message: "Database initialized successfully",
    data,
  });
}
