import express from 'express';
import morgan from 'morgan';

import userRouter from './routers/user';
import authRouter from './routers/auth';

import errorHandler from './middlewares/error';

const app = express();

const isDev = process.env.NODE_ENV === 'development';

app.use(express.json());

app.use(morgan(isDev ? 'dev' : 'combined'));

app.get('/health', (_, res) => res.sendStatus(200));

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use(errorHandler);

export default app;
