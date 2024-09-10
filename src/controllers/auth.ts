import {NextFunction, Request, Response} from 'express';
import {ConflictError, NotFoundError, UnAuthorizedError} from '../utils/error';
import UserService from '../services/user';
import AuthService from '../services/auth';

const userService = new UserService();
const authService = new AuthService();

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userExists = await userService.findUserByEmail(req.body.email);

    if (userExists) throw new ConflictError('user already exist');

    await userService.createUser(req.body);

    res.send({message: 'user created successfully'});
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findUserByEmail(req.body.email);

    if (!user) throw new NotFoundError('user not found');

    const isValid = await authService.validatePassword(
      user?.password,
      req.body.password
    );

    if (!isValid) throw new UnAuthorizedError('invalid email or password');

    const token = authService.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return res.send({message: 'user login sucessfully', token});
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  loginUser,
};
