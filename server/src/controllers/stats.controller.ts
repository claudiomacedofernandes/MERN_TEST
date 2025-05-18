import { Request, Response } from 'express';
import Stats from '../models/stats.model';
import Session from '../models/session.model';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Stats.findOne();
    if (!stats) {
      res.status(404).json({ message: 'Stats not found' });
      return;
    }
    // Count unique logged-in users
    const loggedInUsers = await Session.distinct('userId').count();
    res.json({
      stats: {
        photosAdded: stats.photosAdded,
        photosDeleted: stats.photosDeleted,
        currentPhotos: stats.currentPhotos,
        usersAdded: stats.usersAdded,
        usersDeleted: stats.usersDeleted,
        currentUsers: stats.currentUsers,
        totalLogins: stats.totalLogins,
        totalLogouts: stats.totalLogouts,
        totalLoggedInUsers: loggedInUsers,
        updatedAt: stats.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Middleware to initialize stats if none exist
export const initializeStats = async () => {
  const stats = await Stats.findOne();
  if (!stats) {
    await Stats.create({});
  }
};