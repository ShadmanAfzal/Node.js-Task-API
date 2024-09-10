import {Request, Response, NextFunction} from 'express';
import AuthService from '../services/auth';
import UserService from '../services/user';
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from '../utils/error';
import loggedUser from '../types/user';

const authService = new AuthService();
const userService = new UserService();

const ensureAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) throw new UnAuthorizedError('auth token is required');

    const token = authHeader.split('Bearer ').at(1);

    if (!token) throw new BadRequestError('invalid token');

    const decodedToken = authService.verifyToken(token);

    if (!decodedToken) throw new BadRequestError('invalid token');

    const userId = (decodedToken as loggedUser).id;

    if (!userId) throw new BadRequestError('invalid token');

    const user = await userService.findUserById(userId);

    if (!user) throw new NotFoundError('user not found');

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default ensureAuthentication;
