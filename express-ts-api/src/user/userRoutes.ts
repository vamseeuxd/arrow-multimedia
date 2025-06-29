import { Router } from 'express';
import { getUsers, getUser, addUser, editUser, removeUser, getUserRoles } from './userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/roles', requireRole(['admin', 'manager']), getUserRoles);
router.get('/', requireRole(['admin', 'manager']), getUsers);
router.get('/:id', requireRole(['admin', 'manager']), getUser);
router.post('/', requireRole(['admin']), addUser);
router.put('/:id', requireRole(['admin']), editUser);
router.delete('/:id', requireRole(['admin']), removeUser);

export default router;