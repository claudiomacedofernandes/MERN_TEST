import express from 'express';
import { USER_ROLES } from '../models/user.model';
import { getStats } from '../controllers/stats.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/',
    requireAuth,
    requireRole(USER_ROLES.filter(role => role !== 'guest')),
    getStats
);

export default router;