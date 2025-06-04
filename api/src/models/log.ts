import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now},
});
export const Log = mongoose.model("logs", logSchema);