import { Router } from 'express';
import { login } from './authController';

const router = Router();

router.post('/login', login);

export default router;