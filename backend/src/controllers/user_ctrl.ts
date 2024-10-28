import { Request, Response, NextFunction } from 'express';
import User from '../models/user_mdls'

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
        const { query } = req.query;
        console.log('Search query', query)
        try {
            const users = await User.find({ 
                $or : [
                    { user_name: { $regex: query, $options: 'i' } },
                    { first_name: { $regex: query, $options: 'i' } },
                    { last_name: { $regex: query, $options: 'i' } }
                ]
            }).limit(10);
            console.log('Search results', users)
            res.json(users);
        } catch (error) {
            next(error)
        }
}