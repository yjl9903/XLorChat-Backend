import { Schema, model, Document } from 'mongoose';

import getNextSeq from './counters';
import User from './user';

export type IGroup = {
  gid: number;
  members: Array<number>;
};

const groupSchema = new Schema({
  gid: { type: Number, index: true },
  members: [Number]
});

groupSchema.pre('save', async function(next) {
  const gid = await getNextSeq('groups');
  this.set('gid', gid);
  const members = [];
  for (const uid of this.get('members')) {
    try {
      await User.updateOne(
        { uid },
        {
          $push: { groups: gid }
        }
      ).exec();
      members.push(uid);
    } catch (err) {}
  }
  this.set('members', members);
  next();
});

export default model<Document & IGroup>('groups', groupSchema);
