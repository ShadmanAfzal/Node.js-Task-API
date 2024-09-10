import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
