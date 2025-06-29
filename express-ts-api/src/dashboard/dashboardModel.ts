import User from '../user/UserModel';

export interface DashboardStats {
  totalUsers: number;
}

export interface DashboardData {
  message: string;
  stats: DashboardStats;
}