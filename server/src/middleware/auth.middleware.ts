import { Request, Response, NextFunction } from 'express';
import { DecodedToken, decodeToken } from '../utils/tokens.utils';
import Session from '../models/session.model';

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

// Middleware to verify JWT from cookie and extract user info
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify session exists
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized: Session expired or invalid' });
    }
    // Attach user info to request
    req.user = decodeToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Middleware to restrict access based on user role
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.userrole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}