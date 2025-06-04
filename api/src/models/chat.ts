import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  room: String,
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
export const Message = mongoose.model("messages", userSchema);