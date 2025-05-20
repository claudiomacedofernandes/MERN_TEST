import { CookieOptions } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace in .env for production
const JWT_EXPIRES_IN = '1d'; // token expiry 1 day
const COOKIE_NAME = 'token'; // cookie identifyer

export interface DecodedToken {
    userid: string;
    username: string;
    userrole: string;
    token: string;
}

export const generateToken = (user: string | object | Buffer): string => {
    const token = jwt.sign(user, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
    return token;
}

export const decodeToken = (token: string): DecodedToken => {
    return jwt.verify(token, JWT_SECRET) as any;
}

export const getCookieName = (): string => {
    return COOKIE_NAME;
}

export const getCookieOptions = (): CookieOptions => {
    return {
        // httpOnly: JavaSscript running in the browser cannot read or modify it
        httpOnly: true,
        // secure: true (in production) if you're using HTTPSF
        secure: false, // process.env.NODE_ENV === 'production'
        // Prevents cookies from being sent in any cross-site requests
        sameSite: 'lax', // 'strict', lax'  (in production) or 'none'
        maxAge: 24 * 60 * 60 * 1000,  // 1 day
    };
}