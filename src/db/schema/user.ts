import {CallbackWithoutResultAndOptionalError, Schema} from 'mongoose';
import TaskSchema, {ITask} from './task';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tasks: ITask[];
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [TaskSchema],
});

UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 8);

    next();
  }
);

export default UserSchema;
