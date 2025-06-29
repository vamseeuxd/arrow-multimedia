import bcrypt from 'bcryptjs';
import User from './UserModel';
import Role from '../roles/RoleModel';

export const getAllUsers = async () => {
  return await User.find({}, { password: 0 });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id, { password: 0 });
  if (!user) throw new Error('User not found');
  return user;
};

export const createUser = async (name: string, email: string, password: string, role: string = 'user') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');
  
  const roleExists = await Role.findOne({ name: role });
  if (!roleExists) throw new Error('Invalid role');
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

export const updateUser = async (id: string, name: string, email: string, role: string, password?: string) => {
  const roleExists = await Role.findOne({ name: role });
  if (!roleExists) throw new Error('Invalid role');
  
  const updateData: any = { name, email, role };
  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }
  
  const user = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password' });
  if (!user) throw new Error('User not found');
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};