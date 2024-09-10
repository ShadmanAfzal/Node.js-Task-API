import {NotFoundError} from '../utils/error';
import UserService from '../services/user';
import {NextFunction, Request, Response} from 'express';

const userService = new UserService();

const getLoggedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.findUserById(req.user.id);

    if (!user) throw new NotFoundError('user not found');

    res.send({user});
  } catch (error) {
    next(error);
  }
};

export default {
  getLoggedUser,
};
