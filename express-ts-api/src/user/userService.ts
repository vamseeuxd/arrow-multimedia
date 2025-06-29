import bcrypt from 'bcryptjs';
import User from './UserModel';
import Role from '../roles/RoleModel';

export const getAllUsers = async () => {
  return await User.find({}, { password: 0 }).populate('role', 'name description');
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id, { password: 0 }).populate('role', 'name description');
  if (!user) throw new Error('User not found');
  return user;
};

export const createUser = async (name: string, email: string, password: string, roleId: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');
  
  const roleExists = await Role.findById(roleId);
  if (!roleExists) throw new Error('Invalid role');
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: roleId });
  const populatedUser = await User.findById(user._id, { password: 0 }).populate('role', 'name description');
  return populatedUser;
};

export const updateUser = async (id: string, name: string, email: string, roleId: string, password?: string) => {
  const roleExists = await Role.findById(roleId);
  if (!roleExists) throw new Error('Invalid role');
  
  const updateData: any = { name, email, role: roleId };
  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }
  
  const user = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password' }).populate('role', 'name description');
  if (!user) throw new Error('User not found');
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};

export const getAllRolesForUsers = async () => {
  return await Role.find({}, 'name description');
};