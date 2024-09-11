import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../utils/env';
import LoggedUser from 'types/user';

const JWT_SIGN_KEY = env.JWT_SIGN_KEY!;

class AuthService {
  generateToken(user: LoggedUser) {
    const token = jwt.sign(user, JWT_SIGN_KEY);
    return token;
  }

  verifyToken(token: string) {
    try {
      const decodedToken = jwt.verify(token, JWT_SIGN_KEY);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  validatePassword(passwordHash: string, passwordToVerify: string) {
    return bcrypt.compare(passwordToVerify, passwordHash);
  }
}

export default AuthService;
