import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';

import User from '../models/user';

export default function(passport: PassportStatic) {
  passport.use(
    new Strategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) return done(null, false, { message: 'No username found' });
        const flag = await bcrypt.compare(password, user.get('password'));
        if (flag) return done(null, user);
        else return done(null, false, { message: 'Incorrect password' });
      } catch (err) {
        done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user['_id']);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
