import express from 'express';

import { register } from '../controllers/auth.controller';
import { login } from '../controllers/auth.controller';
import { logout } from '../controllers/auth.controller';
import { getMe } from '../controllers/auth.controller';

// Creates an Express router instance for modular route handling.
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
