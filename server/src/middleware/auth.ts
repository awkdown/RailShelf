import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Extend the Express Request type to include our user data
export interface AuthRequest extends Request {
    user?: { userId: number; email: string };
}

export function requireAuth(    req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'No token provided. Use: Authorization: Bearer <token>',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            email: string;
        };
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}