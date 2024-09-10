import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';

export const validator = (validationSchema: z.AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await validationSchema.safeParseAsync(req.body);

    const errorMessage = result?.error?.errors;

    if (errorMessage) return res.status(400).send(errorMessage);

    next();
  };
};

export default validator;
