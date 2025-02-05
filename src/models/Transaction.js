import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  sold: Boolean,
  dateOfSale: { type: Date, required: true },  
});


export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);