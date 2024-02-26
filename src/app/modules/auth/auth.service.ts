import { IUser } from './auth.interface';
import User from './auth.model';

const insertIntoDB = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);
  return createdUser;
};

export const AuthService = {
  insertIntoDB,
};
