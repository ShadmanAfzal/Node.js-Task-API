import {model} from 'mongoose';
import UserSchema, {IUser} from './schema/user';

const User = model<IUser>('user', UserSchema);

export default User;
