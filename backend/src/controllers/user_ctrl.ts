import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user_mdls'

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

export const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userIdsString = req.query.userIds as string;
        console.log('Received userIds:', userIdsString);

        if (!userIdsString) {
            res.status(400).json({ 
                message: 'userIds parameter is required',
                received: req.query 
            });
            return;
        }

        const userIds = userIdsString
            .split(',')
            .filter(id => id && id.trim() !== '');

        console.log('Processed userIds:', userIds);

        if (userIds.length === 0) {
            res.status(400).json({ 
                message: 'No valid user IDs provided',
                received: userIdsString 
            });
            return;
        }

        const users = await User.find({
            _id: { $in: userIds }
        }).select('id user_name first_name last_name email');

        console.log('Found users:', users);

        // Fixed typing for reduce function
        const usersMap = users.reduce<Record<string, {
            id: string;
            user_name: string;
            first_name: string;
            last_name: string;
            email: string;
        }>>((acc, user) => {
            acc[user._id.toString()] = {
                id: user._id.toString(),
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            };
            return acc;
        }, {});

        res.json(usersMap);
    } catch (error) {
        console.error('Error in getUserDetails:', error);
        next(error);
    }
};