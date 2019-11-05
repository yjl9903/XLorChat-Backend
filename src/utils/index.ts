import { Request, Response, NextFunction } from 'express';
import cryptoRandomString from 'crypto-random-string';

export function checkAuthenticated(
  req: Request,
  res: Response,
  nxt: NextFunction
) {
  if (req.isAuthenticated()) nxt();
  else res.status(401).send('Unauthorized');
}

export function b64encode(s: string) {
  return Buffer.from(s).toString('base64');
}
export function b64decode(s: string) {
  return Buffer.from(s, 'base64').toString();
}

export function rand(l: number, r: number) {
  return l + Math.round(Math.random() * (r - l));
}

export function randomString(length = 32): string {
  return cryptoRandomString({ length });
}
