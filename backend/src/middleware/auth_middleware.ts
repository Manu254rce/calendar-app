import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { AuthRequest } from 'types/user_types';


const JWT_SECRET = process.env.JWT_SECRET || '1251591768200a3b1715a224ba2fc601b50b18ff1ded1da8b1e41358afefffa780a67df1f59fe01c5ea75fa0a32ccec48952f89cd3dc89a124621d4dce75719b'

export const authMiddleWare = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, isAdmin: boolean };
        req.user = { id: decoded.userId, userId: decoded.userId, isAdmin: decoded.isAdmin };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
}