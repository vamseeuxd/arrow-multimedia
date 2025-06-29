import User from '../user/UserModel';
import { DashboardData } from './dashboardModel';

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  const user = await User.findById(userId);
  const totalUsers = await User.countDocuments();
  return { message: `Welcome to dashboard, ${user?.name}!`, stats: { totalUsers } };
};