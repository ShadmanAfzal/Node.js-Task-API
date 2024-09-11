import {z} from 'zod';
import dotenv from 'dotenv';

const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string(),
  NODE_ENV: z.enum(['production', 'development']),
  JWT_SIGN_KEY: z.string(),
});

dotenv.config();

const env = environmentSchema.parse(process.env);

export default env;
