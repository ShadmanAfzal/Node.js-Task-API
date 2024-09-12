import User from '../db';
import {createUserSchema} from 'utils/validation-schema/user';
import {z} from 'zod';

class UserService {
  /**
   * Creates a new user with the provided details and saves it to the database.
   *
   * @param user - The details of the user to be created, validated against `createUserSchema`.
   * @returns A promise that returns the newly created user object.
   */
  async createUser(user: z.infer<typeof createUserSchema>) {
    const createdUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return await createdUser.save();
  }

  /**
   * Retrieves a user from the database by their email address.
   *
   * @param email - The email address of the user to be found.
   * @returns A promise that returns the user object if a user with the specified email exists; otherwise, `null`.
   */
  async findUserByEmail(email: string) {
    return await User.findOne({
      email,
    });
  }

  /**
   * Retrieves a user from the database by their ID, excluding sensitive fields.
   *
   * @param id - The ID of the user to be found.
   * @returns A promise that returns the user object with the specified ID, excluding `password` and `tasks` fields; or `null` if no user is found.
   */
  async findUserById(id: string) {
    return await User.findById(id).select('-password -tasks');
  }
}

export default UserService;
