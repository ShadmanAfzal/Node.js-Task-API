import http from 'http';
import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT ?? 5000;
const DATABASE_URL = process.env.DATABASE_URL!;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log('Connecting to database...');
  await mongoose.connect(DATABASE_URL);
  console.log('Successfully connected to database...');
  console.log('Server is listening at PORT %s', PORT);
});
