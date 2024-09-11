import User from '../db';
import {createUserSchema} from 'utils/validation-schema/user';
import {z} from 'zod';

class UserService {
  async createUser(user: z.infer<typeof createUserSchema>) {
    const createdUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return await createdUser.save();
  }

  async findUserByEmail(email: string) {
    return await User.findOne({
      email,
    });
  }

  async findUserById(id: string) {
    return await User.findById(id).select('-password -tasks');
  }
}

export default UserService;
