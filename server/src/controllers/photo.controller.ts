import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { DecodedToken } from '../utils/tokens.utils';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import Photo, { IPhoto } from '../models/photo.model';
import User, { USER_ROLES } from '../models/user.model';

dotenv.config();

export const getPhotos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const photos = await Photo.find()
      .populate('userId', 'username role')
      .sort({ uploadedAt: -1 });

    res.json({
      photos: photos.map((photo: IPhoto) => ({
        id: photo._id,
        filename: photo.filename,
        path: photo.path,
        userid: photo.userId ? (photo.userId as any).id : '',
        username: photo.userId ? (photo.userId as any).username : '',
        userrole: photo.userId ? (photo.userId as any).role : '',
        uploadedAt: photo.uploadedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const uploadPhoto = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ message: 'Forbidden: No user identification' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = req.user as DecodedToken;
    const photo = await Photo.create({
      filename: req.file.filename,
      path: `/storage/${req.file.filename}`,
      userId: user.userid
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: {
        id: photo._id,
        filename: photo.filename,
        path: photo.path,
        userid: photo.userId,
        username: user.username,
        userrole: user.userrole,
        uploadedAt: photo.uploadedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deletePhoto = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ message: 'Forbidden: No user identification' });
      return;
    }

    const photoId = req.params.id;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      res.status(404).json({ message: 'Photo not found' });
      return;
    }

    // Check if user is owner or has higher role than owner
    const user = req.user as DecodedToken;
    const owner = await User.findById(photo.userId);

    if (user && owner) {
      const userRoleIndex = USER_ROLES.indexOf(user?.userrole || USER_ROLES[USER_ROLES.length - 1]);
      const ownerRoleIndex = USER_ROLES.indexOf(owner?.role || USER_ROLES[0]);

      if ((user.userid !== owner.id && userRoleIndex >= ownerRoleIndex)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }
    } else if (user) {
      if (!USER_ROLES.filter(role => role !== 'guest' && role !== 'user').includes(user?.userrole)) {
        res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        return;
      }
    } else {
      res.status(403).json({ message: 'Forbidden: The server information is invalid' });
      return;
    }

    // Delete file from storage
    const filePath = path.join(__dirname, `../${process.env.STORAGE_PATH || '../storage'}`, photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Photo.deleteOne({ _id: photoId });
    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};