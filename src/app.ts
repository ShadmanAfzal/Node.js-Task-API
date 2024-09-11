import express from 'express';
import morgan from 'morgan';

import userRouter from './routers/user';
import authRouter from './routers/auth';
import tasksRouter from './routers/task';

import errorHandler from './middlewares/error';
import env from './utils/env';

const app = express();

const isDev = env.NODE_ENV === 'development';

app.use(express.json());

app.use(morgan(isDev ? 'dev' : 'combined'));

app.get('/health', (_, res) => res.sendStatus(200));

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use('/tasks', tasksRouter);

app.use(errorHandler);

export default app;
