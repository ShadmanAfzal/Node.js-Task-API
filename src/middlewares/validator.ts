import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';

/**
 * Middleware function for validating request bodies against a Zod schema.
 *
 * @param validationSchema - The Zod schema to validate the request body against.
 * @returns An Express middleware function that validates the request body and handles errors.
 */
export const validator = (validationSchema: z.AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await validationSchema.safeParseAsync(req.body);

    if (result.error) {
      const formattedErrors = result.error.errors.map(error => {
        return {
          field: error.path.join('.'),
          message: error.message,
        };
      });
      return res.status(400).send({
        message: 'validation failed',
        error: formattedErrors,
      });
    }

    next();
  };
};

export default validator;
