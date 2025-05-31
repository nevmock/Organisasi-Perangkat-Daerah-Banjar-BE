import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token tidak ditemukan' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = verify(token, secret);
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token tidak valid' });
    }
};

export default authenticateToken;
