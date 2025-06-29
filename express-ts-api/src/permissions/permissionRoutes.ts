import { Router } from 'express';
import { getPermissions, getPermission, addPermission, editPermission, removePermission } from './permissionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['superAdmin', 'admin']), getPermissions);
router.get('/:id', requireRole(['superAdmin', 'admin']), getPermission);
router.post('/', requireRole(['superAdmin']), addPermission);
router.put('/:id', requireRole(['superAdmin']), editPermission);
router.delete('/:id', requireRole(['superAdmin']), removePermission);

export default router;