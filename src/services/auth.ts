import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SIGN_KEY = process.env.JWT_SIGN_KEY!;

class AuthService {
  generateToken(user: any) {
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
