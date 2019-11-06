import { Router } from 'express';
import passport from 'passport';

import register from './register';
import login from './login';
import { IUser, Group, User } from '../models';

const router = Router();

router.post('/register', register, passport.authenticate('local'), login);

router.post('/login', passport.authenticate('local'), login);

router.get('/', (req, res) => {
  if (req.user) {
    const user = req.user as IUser;
    res.send(user.getInfo(true));
  } else {
    res.sendStatus(401);
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send({ status: 'ok' });
});

router.post('/create', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const user = req.user as IUser;
  const members = [user.uid, ...req.body.members];
  const group = new Group({ members });
  await group.save();
  const arr = [];
  for (const uid of group.members) {
    arr.push((await User.findOne({ uid }).exec()).getInfo(false));
  }
  res.send({
    gid: group.gid,
    members: arr
  });
});

router.get('/group', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const user = req.user as IUser;
  const tasks = [];
  for (const gid of user.groups) {
    tasks.push(Group.findOne({ gid }).exec());
  }
  const arr = await Promise.all(tasks);
  const groups = [];
  for (const { gid, members } of arr) {
    const g = {
      gid,
      members: []
    };
    for (const uid of members) {
      g.members.push((await User.findOne({ uid }).exec()).getInfo(false));
    }
    groups.push(g);
  }
  res.send(groups);
});

export default router;
