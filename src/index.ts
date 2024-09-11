import http from 'http';
import app from './app';
import mongoose from 'mongoose';
import env from './utils/env';

const PORT = env.PORT ?? 5000;

const DATABASE_URL = env.DATABASE_URL;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log('Connecting to database...');
  await mongoose.connect(DATABASE_URL);
  console.log('Successfully connected to database...');
  console.log('Server is listening at PORT %s', PORT);
});
