import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { AuthenticatedRequest } from '../middleware/auth.middleware';
import User, { USER_ROLES, USER_ROLE_DEFAULT } from '../models/user.model';
import Session from '../models/session.model';
import { generateToken, decodeToken, getCookieName, getCookieOptions, DecodedToken } from '../utils/tokens.utils';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password, role } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({ username, role: USER_ROLES.includes(role) ? role : USER_ROLE_DEFAULT, password });

        // After saving the user
        const token = generateToken({ userid: user._id, username: user.username, userrole: user.role });
        // Create session
        await Session.create({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        res
            .cookie(getCookieName(), token, getCookieOptions())
            .status(201).json({
                message: 'Logged in successfully.', user: {
                    userid: user._id,
                    username: user.username,
                    userrole: user.role,
                    token: token,
                }
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials.' })
            return;
        };

        const match = await user.matchPassword(password);
        if (!match) {
            res.status(400).json({ message: 'Invalid credentials.' })
            return;
        };

        const token = generateToken({ userid: user._id, username: user.username, userrole: user.role });
        // Create session
        await Session.create({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        res
            .cookie(getCookieName(), token, getCookieOptions())
            .json({ message: 'Logged in successfully.', user: { token, userid: user._id, username: user.username, userrole: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.', error: err });
    }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const token = req.cookies.token;
        if (token) {
            // Delete session
            await Session.deleteOne({ token });
        }
        res.clearCookie(getCookieName()).json({ message: 'Logged out.' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed.', error: err });
    }
};

export const updateRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(403).json({ message: 'Forbidden: No user identification' });
            return;
        }

        const userRequest = req.user as DecodedToken;
        const { role } = req.body;
        if (!userRequest.userid || !role) {
            res.status(400).json({ message: 'User ID and role are required' });
            return;
        }

        const user = await User.findById(userRequest.userid);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!USER_ROLES.includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        user.role = role;
        await user.save();

        // Generate new token with updated role
        const token = generateToken({ userid: user._id, username: user.username, userrole: user.role });
        res
            .cookie(getCookieName(), token, getCookieOptions())
            .json({
                message: 'Role updated successfully',
                user: {
                    userid: user._id,
                    username: user.username,
                    userrole: user.role
                }
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};