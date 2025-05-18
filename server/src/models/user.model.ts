import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// The user roles by Hierarchy
export const USER_ROLES = ['superadmin', 'admin', 'user', 'guest'];
export const USER_ROLE_DEAULT = 'guest';

export interface IUser extends Document {
    username: string;
    password: string;
    role: string;
    matchPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: USER_ROLE_DEAULT }
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
