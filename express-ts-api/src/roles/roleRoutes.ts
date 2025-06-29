import { Router } from 'express';
import { getRoles, getRole, addRole, editRole, removeRole } from './roleController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['admin']), getRoles);
router.get('/:id', requireRole(['admin']), getRole);
router.post('/', requireRole(['admin']), addRole);
router.put('/:id', requireRole(['admin']), editRole);
router.delete('/:id', requireRole(['admin']), removeRole);

export default router;