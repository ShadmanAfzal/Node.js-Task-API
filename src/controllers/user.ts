import UserService from '../services/user';
import {NotFoundError} from '../utils/error';
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

    return res.send({message: 'user details fetched successfully', user});
  } catch (error) {
    next(error);
  }
};

export default {
  getLoggedUser,
};
