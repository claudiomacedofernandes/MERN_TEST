import express from 'express';

import { register, login, logout, getMe, updateRole } from '../controllers/auth.controller';

// Creates an Express router instance for modular route handling.
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/update-role', updateRole);

export default router;
