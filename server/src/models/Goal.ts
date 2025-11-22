import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: Number, default: 0 },
    image: { type: String }, // stored path (relative to /uploads)
  },
  { timestamps: true }
);

export const Goal = mongoose.model("Goal", goalSchema);
