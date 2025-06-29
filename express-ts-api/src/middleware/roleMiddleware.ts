import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import User from '../user/UserModel';

export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId).populate('role', 'name');
      if (!user || !user.role || !roles.includes((user.role as any).name)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};