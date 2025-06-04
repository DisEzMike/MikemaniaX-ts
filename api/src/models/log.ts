import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});
export const Log = mongoose.model("logs", logSchema);