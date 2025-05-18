import express from 'express';
import { uploadPhoto, getPhotos, deletePhoto } from '../controllers/photo.controller';
import { upload } from '../utils/multer.utils';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Upload photo (all roles except Guest)
router.post(
  '/upload',
  upload.single('photo'),
  uploadPhoto
);

// Get all photos (all roles)
router.get('/', getPhotos);

// Delete photo (authorized users only)
router.delete('/:id', deletePhoto);

export default router;