import express from 'express';

import { USER_ROLES } from '../models/user.model';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { register, login, logout, getMe, updateRole } from '../controllers/auth.controller';

// Creates an Express router instance for modular route handling.
const router = express.Router();
router.get('/me', getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.put(
    '/update-role',
    requireAuth,
    requireRole(USER_ROLES.filter(role => role !== 'guest')),
    updateRole
);

export default router;
