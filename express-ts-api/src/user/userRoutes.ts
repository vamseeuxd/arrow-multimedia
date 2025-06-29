import { Router } from 'express';
import { getUsers, getUser, addUser, editUser, removeUser, getUserRoles } from './userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/roles', requireRole(['superAdmin', 'admin', 'manager']), getUserRoles);
router.get('/', requireRole(['superAdmin', 'admin', 'manager']), getUsers);
router.get('/:id', requireRole(['superAdmin', 'admin', 'manager']), getUser);
router.post('/', requireRole(['superAdmin', 'admin']), addUser);
router.put('/:id', requireRole(['superAdmin', 'admin']), editUser);
router.delete('/:id', requireRole(['superAdmin', 'admin']), removeUser);

export default router;