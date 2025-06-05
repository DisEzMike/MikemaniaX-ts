import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., 'request'
  seq: { type: Number, default: 0 }
});

export const Counter = mongoose.model('couter', counterSchema);