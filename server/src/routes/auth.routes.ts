import express from 'express';

import { USER_ROLES } from '../models/user.model';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { register, login, logout, updateRole } from '../controllers/auth.controller';
import { trackStats } from '../middleware/stats.middleware';

// Creates an Express router instance for modular route handling.
const router = express.Router();
router.post('/register', trackStats('userAdded'), register);
router.post('/login', trackStats('login'), login);
router.post('/logout', requireAuth, trackStats('logout'), logout);
router.put(
    '/update-role',
    requireAuth,
    requireRole(USER_ROLES.filter(role => role !== 'guest')),
    updateRole
);

export default router;
