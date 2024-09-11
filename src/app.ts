import express from 'express';
import morgan from 'morgan';

import userRouter from './routers/user';
import authRouter from './routers/auth';
import tasksRouter from './routers/task';

import errorHandler from './middlewares/error';
import env from './utils/env';
import ensureAuthentication from './middlewares/auth';

const app = express();

const isDev = env.NODE_ENV === 'development';

app.use(express.json());

app.use(morgan(isDev ? 'dev' : 'combined'));

app.get('/health', (req, res) => res.sendStatus(200));

app.use('/auth', authRouter);

app.use('/user', ensureAuthentication, userRouter);

app.use('/tasks', ensureAuthentication, tasksRouter);

app.use(errorHandler);

export default app;
