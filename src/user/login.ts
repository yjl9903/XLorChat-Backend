import { Request, Response } from 'express';

import { IUser } from '../models';

export default async function(req: Request, res: Response) {
  const user = req.user as IUser;
  res.send(user.getInfo(true));
}
