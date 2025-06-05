import mongoose from "mongoose";
import { Counter } from "./counter";
import { getNextSequence } from "../utils/increment";

export interface ILog extends Document {
  message: string;
  timestamp: Date;
  seq: number
}

const logSchema = new mongoose.Schema<ILog>({
  message: String,
  timestamp: { type: Date, default: Date.now},
  seq: { type: Number, unique: true },
});

logSchema.pre("save", async function (next) {
  if (this.isNew && typeof this.seq !== "number") {
    try {
      this.seq = await getNextSequence("log")
    } catch (err) {
      next(err as any);
    }
  } else {
    next();
  }
})

export const Log = mongoose.model<ILog>("logs", logSchema);