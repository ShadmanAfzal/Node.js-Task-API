import LoggedUser from './types/user';

declare global {
  namespace Express {
    interface Request {
      user: LoggedUser;
    }
  }
}
