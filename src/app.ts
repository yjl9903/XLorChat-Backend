import express from 'express';
import expressWs from 'express-ws';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import redis from 'redis';
import connectRedis from 'connect-redis';
import mongoose from 'mongoose';
import passport from 'passport';

const app = express();
expressWs(app);

mongoose.connect('mongodb://mongo:27017/chat', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

import userRouter, { setPassport } from './user';
import chatRouter from './chat';
import { SecretKey, appUrl } from './configs';

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (origin.indexOf(appUrl) === 0) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

const RedisStore = connectRedis(session);
const client = redis.createClient('redis://redis:6379');
app.use(
  session({
    store: new RedisStore({ client }),
    secret: SecretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 3600 * 1000
    }
  })
);

setPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/chat', chatRouter);

export default app;
