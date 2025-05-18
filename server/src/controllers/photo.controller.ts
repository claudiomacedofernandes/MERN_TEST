import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { AuthenticatedRequest } from '../middleware/auth.middleware';
import Photo, { IPhoto } from '../models/photo.model';
import User, { USER_ROLES } from '../models/user.model';

export const uploadPhoto = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Parse user info from FormData
    let userInfo = {};
    if (req.body.user) {
      try {
        userInfo = JSON.parse(req.body.user); // { userid, username, userrole }
      } catch (err) {
        res.status(400).json({ message: 'Invalid user info format' });
        return;
      }
    }

    const { userid } = userInfo as any;
    const photo = await Photo.create({
      filename: req.file.filename,
      path: `/storage/${req.file.filename}`,
      userId: userid
    });

    const user = await User.findById(photo.userId).select('username');
    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: {
        id: photo._id,
        filename: photo.filename,
        path: photo.path,
        useid: photo.userId,
        username: user?.username,
        userrole: user?.role,
        uploadedAt: photo.uploadedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

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

export const deletePhoto = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const photoId = req.params.id;
    const photo = await Photo.findById(photoId).populate('userId', 'username role');
    if (!photo) {
      res.status(404).json({ message: 'Photo not found' });
      return;
    }

    if (!req.body || !req.body.userid) {
      res.status(403).json({ message: 'Forbidden: Invalid request' });
      return;
    }

    // Check if user is owner or has higher role than owner
    const user = await User.findById(req.body.userid);
    const owner = await User.findById(photo.userId);
    const userRoleIndex = USER_ROLES.indexOf(user?.role || USER_ROLES[USER_ROLES.length - 1]);
    const ownerRoleIndex = USER_ROLES.indexOf(owner?.role || USER_ROLES[0]);

    if (!user || !owner || (user.id !== owner.id && userRoleIndex >= ownerRoleIndex)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '../../storage', photo.filename);
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