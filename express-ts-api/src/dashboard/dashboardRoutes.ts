import { Router } from 'express';
import { dashboard } from './dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, dashboard);

export default router;