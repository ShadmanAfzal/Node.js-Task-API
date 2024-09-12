import {z} from 'zod';

// Zod schema for creating users request body
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

// Zod schema for login user request body
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
