import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    note: { type: String },
    salaryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Salary", required: true },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
