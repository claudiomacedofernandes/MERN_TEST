import { Request, Response, NextFunction } from 'express';
import Stats from '../models/stats.model';
import { AuthenticatedRequest } from './auth.middleware';

export const trackStats = (action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await Stats.findOne();
      if (!stats) {
        await Stats.create({});
      }

      switch (action) {
        case 'photoAdded':
          await Stats.updateOne({}, { $inc: { photosAdded: 1, currentPhotos: 1 } });
          break;
        case 'photoDeleted':
          await Stats.updateOne({}, { $inc: { photosDeleted: 1, currentPhotos: -1 } });
          break;
        case 'userAdded':
          await Stats.updateOne({}, { $inc: { usersAdded: 1, currentUsers: 1 } });
          break;
        case 'userDeleted':
          await Stats.updateOne({}, { $inc: { usersDeleted: 1, currentUsers: -1 } });
          break;
        case 'login':
          await Stats.updateOne({}, { $inc: { totalLogins: 1 } });
          break;
        case 'logout':
          await Stats.updateOne({}, { $inc: { totalLogouts: 1 } });
          break;
      }
      next();
    } catch (err) {
      console.error('Stats tracking error:', err);
      next();
    }
  };
};