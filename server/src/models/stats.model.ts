import mongoose, { Document, Schema } from 'mongoose';

export interface IStats extends Document {
  photosAdded: number;
  photosDeleted: number;
  currentPhotos: number;
  usersAdded: number;
  usersDeleted: number;
  currentUsers: number;
  totalLogins: number;
  totalLogouts: number;
  totalLoggedInUsers: number;
  updatedAt: Date;
}

const StatsSchema: Schema = new Schema({
  photosAdded: { type: Number, default: 0 },
  photosDeleted: { type: Number, default: 0 },
  currentPhotos: { type: Number, default: 0 },
  usersAdded: { type: Number, default: 0 },
  usersDeleted: { type: Number, default: 0 },
  currentUsers: { type: Number, default: 0 },
  totalLogins: { type: Number, default: 0 },
  totalLogouts: { type: Number, default: 0 },
  totalLoggedInUsers: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStats>('Stats', StatsSchema);