import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/user_types';

export const adminMiddleWare = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ message: 'Access denied. Admins only.' });
        // return;
    }
    next();
};