import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    remaining: { type: Number, required: true },
  },
  { timestamps: true }
);

// Ensure one salary per user per month+year at DB level
salarySchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Salary = mongoose.model("Salary", salarySchema);
