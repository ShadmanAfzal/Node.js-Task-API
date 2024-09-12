import {z} from 'zod';
import dotenv from 'dotenv';

// Define a schema for environment variables using Zod
const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string(),
  NODE_ENV: z.enum(['production', 'development']),
  JWT_SIGN_KEY: z.string(),
});

// Load environment variables from a .env file
dotenv.config();

// Parse and validate the environment variables using the defined schema, throws errors if validation fails
const env = environmentSchema.parse(process.env);

export default env;
