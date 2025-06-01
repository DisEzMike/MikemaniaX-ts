import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  userId: String,
  pictureUrl: String,
  displayName: String,
  statusMessage: String,
  role: {
    type: String,
    default: "user"
  }
}, {timestamps: true});
  
export const User = mongoose.model("users", userSchema);