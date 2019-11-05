import { Router } from 'express';
import WebSocket from 'ws';

import { IUser } from '../models';

const router = Router();

const gidMap = new Map<number, Array<WebSocket>>();

router.all('*', (req, res, nxt) => {
  req.isAuthenticated();
  if (req.user) nxt();
  else res.sendStatus(401);
});

router.ws('/:gid', (ws, req) => {
  const user = (req.user as IUser).getInfo(false);
  const gid = Number(req.params.gid);
  if (gidMap.has(gid)) {
    const arr = gidMap.get(gid);
    arr.push(ws);
    gidMap.set(gid, arr);
  } else {
    gidMap.set(gid, [ws]);
  }
  ws.on('open', () => {
    const arr = gidMap.get(gid);
    const data = JSON.stringify({ type: 'login', user });
    for (const c of arr) c.send(data);
  });
  ws.on('message', msg => {
    const arr = gidMap.get(gid);
    const data = JSON.stringify({ type: 'message', user, message: msg });
    for (const c of arr) c.send(data);
  });
  ws.on('close', () => {
    const arr = gidMap.get(gid);
    const id = arr.indexOf(ws);
    if (id !== -1) {
      arr.splice(id, 1);
      if (arr.length > 0) {
        gidMap.set(gid, arr);
      } else {
        gidMap.delete(gid);
      }
    } else {
      throw new Error('cant find ws');
    }
  });
});

export default router;
