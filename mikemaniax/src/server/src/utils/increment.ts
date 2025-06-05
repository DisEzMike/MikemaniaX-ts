import { Counter } from '../models/counter';

/**
 * Get the next sequence number for a given sequence name.
 * @param sequenceName e.g. "request", "order"
 */
export async function getNextSequence(sequenceName: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}