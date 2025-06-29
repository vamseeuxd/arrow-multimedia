import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getDashboardData } from './dashboardService';

export const dashboard = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getDashboardData(req.userId!);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};