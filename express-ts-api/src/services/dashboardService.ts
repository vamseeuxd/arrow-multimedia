import User from '../models/User';

export const getDashboardData = async (userId: string) => {
  const user = await User.findById(userId);
  const totalUsers = await User.countDocuments();
  return { message: `Welcome to dashboard, ${user?.name}!`, stats: { totalUsers } };
};