import bcrypt from 'bcryptjs';
import User from './UserModel';

export const getAllUsers = async () => {
  return await User.find({}, { password: 0 });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id, { password: 0 });
  if (!user) throw new Error('User not found');
  return user;
};

export const createUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return { id: user._id, name: user.name, email: user.email };
};

export const updateUser = async (id: string, name: string, email: string, password?: string) => {
  const updateData: any = { name, email };
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