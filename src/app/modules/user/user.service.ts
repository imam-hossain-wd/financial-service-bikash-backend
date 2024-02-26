/* eslint-disable prefer-const */
import { IFilters, IUser } from '../auth/auth.interface';
import { User } from '../auth/auth.model';
import { userSearchAbleFields } from './user.constrants';

const getAllUsers = async (filters: IFilters): Promise<IUser[] | null> => {
  const { searchTerm, ...filtersData } = filters;
  const status = filtersData.status;

  const andConditions = [];

  if (searchTerm) {
    const orConditions = userSearchAbleFields.map(field => {
      return {
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      };
    });

    andConditions.push({ $or: orConditions });
  }

  if (status) {
    andConditions.push({ account_status: status });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions);
  return result;
};

const updateUser = async (
  UserId: string,
  updatedData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(UserId, updatedData, { new: true });
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  getAllUsers,
  updateUser,
  deleteUser
};
