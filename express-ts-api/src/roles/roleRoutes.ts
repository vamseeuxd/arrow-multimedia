import { Router } from 'express';
import { getRoles, getRole, addRole, editRole, removeRole } from './roleController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['superAdmin', 'admin']), getRoles);
router.get('/:id', requireRole(['superAdmin', 'admin']), getRole);
router.post('/', requireRole(['superAdmin']), addRole);
router.put('/:id', requireRole(['superAdmin']), editRole);
router.delete('/:id', requireRole(['superAdmin']), removeRole);

export default router;