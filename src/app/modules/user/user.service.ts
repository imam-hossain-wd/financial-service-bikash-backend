import { IUser } from "../auth/auth.interface";
import { User } from "../auth/auth.model";


const getAllUsers = async (): Promise<IUser[] | null> => {
    const users = await User.find();
    return users;
};



export const UserService = {
    getAllUsers
}
  