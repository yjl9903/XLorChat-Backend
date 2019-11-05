import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type IUser = {
  uid: Number;
  username: String;
  password: string;
  name: string;
  email: string;
  groups: Array<number>;
  getInfo(
    withGroup: boolean
  ): { uid: number; username: string; name: string; email: string };
};

const userSchema: Schema = new Schema({
  uid: { type: Number, index: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  groups: [Number]
});

userSchema.methods.getInfo = function(withGroup: boolean = true) {
  if (withGroup) {
    return {
      uid: this.uid,
      username: this.username,
      name: this.name,
      email: this.email,
      groups: this.groups
    };
  } else {
    return {
      uid: this.uid,
      username: this.username,
      name: this.name,
      email: this.email
    };
  }
};

userSchema.pre('save', async function(next) {
  this.set(
    'password',
    await bcrypt.hash(this.get('password'), await bcrypt.genSalt(10))
  );
  next();
});

export default model<Document & IUser>('users', userSchema);
