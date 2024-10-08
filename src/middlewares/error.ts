import {Request, Response, NextFunction} from 'express';
import HttpError from '../utils/error/index';

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = 'Internal Server Error';
  let statusCode = 500;

  if (error instanceof HttpError) {
    message = error.message;
    statusCode = error.statusCode;
  }
  console.error(error);
  res.status(statusCode).send({error: message});
};

export default errorHandler;
