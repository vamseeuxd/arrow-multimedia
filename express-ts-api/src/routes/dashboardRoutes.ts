import { Router } from 'express';
import { dashboard } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, dashboard);

export default router;