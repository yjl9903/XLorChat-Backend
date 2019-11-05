import { NextFunction, Request, Response } from 'express';

import { getNextSeq, User } from '../models';

export default async function(req: Request, res: Response, nxt: NextFunction) {
  const new_user = new User(req.body);
  try {
    await new_user.save();
    await User.updateOne(
      { username: new_user.username },
      { $set: { uid: await getNextSeq('users') } }
    );
    nxt();
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      const arr = Reflect.ownKeys(err.keyPattern);
      res.status(400).send({ message: 'duplicate key', keys: arr });
    } else {
      res.status(400).send({ message: err.message });
    }
  }
}
