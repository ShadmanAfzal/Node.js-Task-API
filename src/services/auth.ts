import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../utils/env';
import LoggedUser from 'types/user';

const JWT_SIGN_KEY = env.JWT_SIGN_KEY!;

class AuthService {
  /**
   * Generates a JWT token for a given user.
   *
   * @param user - The user object containing the payload to be included in the token.
   * @returns The generated JWT token as a string.
   */
  generateToken(user: LoggedUser) {
    const token = jwt.sign(user, JWT_SIGN_KEY);
    return token;
  }

  /**
   * Verifies a JWT token and returns the decoded token if valid.
   *
   * @param token - The JWT token to be verified.
   * @returns The decoded token payload if the token is valid; otherwise, `null`.
   * @throws This function catches any errors during verification and returns `null` instead of propagating the error.
   */
  verifyToken(token: string) {
    try {
      const decodedToken = jwt.verify(token, JWT_SIGN_KEY);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validates a password by comparing the provided password with the stored password hash.
   *
   * @param passwordHash - The hashed password stored in the database.
   * @param passwordToVerify - The plain-text password provided by the user for verification.
   * @returns A promise that returns `true` if the password matches the hash, or `false` otherwise.
   */
  validatePassword(passwordHash: string, passwordToVerify: string) {
    return bcrypt.compare(passwordToVerify, passwordHash);
  }
}

export default AuthService;
