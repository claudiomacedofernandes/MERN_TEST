import express from 'express';
import { upload } from '../utils/multer.utils';
import { USER_ROLES } from '../models/user.model';
import { uploadPhoto, getPhotos, deletePhoto } from '../controllers/photo.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

// Get all photos (all roles)
router.get('/', getPhotos);

// Upload photo (all roles except Guest)
router.post(
  '/upload',
  requireAuth,
  requireRole(USER_ROLES.filter(role => role !== 'guest')),
  upload.single('photo'),
  uploadPhoto
);

// Delete photo (authorized users only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(USER_ROLES.filter(role => role !== 'guest')),
  deletePhoto
);

export default router;