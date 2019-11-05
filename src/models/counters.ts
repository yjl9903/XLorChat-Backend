import { Schema, model, Document } from 'mongoose';

export type ICounter = Document & {
  _id: string;
  seq: number;
};

const counterSchema: Schema = new Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});

const Counters = model<ICounter>('counters', counterSchema);

export default async function getNextSeq(name: 'users' | 'groups') {
  const res = await Counters.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true }
  ).exec();
  return res.seq;
}
