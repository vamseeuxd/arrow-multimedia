import { Router } from 'express';
import { getPermissions, getPermission, addPermission, editPermission, removePermission } from './permissionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['admin']), getPermissions);
router.get('/:id', requireRole(['admin']), getPermission);
router.post('/', requireRole(['admin']), addPermission);
router.put('/:id', requireRole(['admin']), editPermission);
router.delete('/:id', requireRole(['admin']), removePermission);

export default router;