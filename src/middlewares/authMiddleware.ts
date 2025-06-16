import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserPayload } from '../types/UserPayload';

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}

const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token tidak ditemukan' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = verify(token, secret) as UserPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};

export default authenticateToken;
