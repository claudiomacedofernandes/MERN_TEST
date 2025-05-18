import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/user.model';
import { generateToken, decodeToken, getCookieName, getCookieOptions } from '../utils/tokens.utils';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });

        // After saving the user
        const token = generateToken({ id: user._id });
        res.cookie('token', token, getCookieOptions());

        res.status(201).json({
            message: 'Logged in successfully.', user: {
                userid: user._id,
                username: user.username,
                userrole: user.role,
                token: token,
            }});
    } catch (err) {
        console.log(err);
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

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({ message: 'Invalid credentials.' })
            return;
        };

        const token = generateToken({ userid: user._id, userrole: user.role });
        res
            .cookie(getCookieName(), token, getCookieOptions())
            .json({ message: 'Logged in successfully.', user: { token, userid: user._id, username: user.username, userrole: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.', error: err });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = decodeToken(token);
        const user = await User.findById(decoded.userid).select('-password');

        res.json(user);
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const logout = (_: Request, res: Response) => {
    res.clearCookie(getCookieName()).json({ message: 'Logged out.' });
};
