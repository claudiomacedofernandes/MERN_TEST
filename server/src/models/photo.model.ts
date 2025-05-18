import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  filename: string;
  path: string;
  userId: mongoose.Types.ObjectId;
  userRole: string;
  uploadedAt: Date;
}

const PhotoSchema: Schema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema);