import { Response, NextFunction } from 'express';
import User from '../models/user_mdls';
import { AuthRequest } from '../types/user_types';
import bcrypt from 'bcryptjs';

export const searchUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const { query } = req.query;
    console.log('Search query', query)
    try {
        const users = await User.find({
            $or: [
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

export const getUserDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

export const updateUserDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const { firstName, lastName, email, userName, userRole, preferences } = req.body;

    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User  not found' });
            return;
        }

        const validJobRoles = [
            'radio_presenting',
            'onsite_journalist',
            'newsroom',
            'digital',
            'developer'
        ]

        if (userRole && !validJobRoles.includes(userRole)) {
            res.status(400).json({ message: 'Invalid job role' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email) {
            if (!emailRegex.test(email)) {
                res.status(400).json({ message: 'Invalid email format' });
                return;
            }

            const existingEmailUser = await User.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existingEmailUser) {
                res.status(400).json({ message: 'Email is already in use' });
                return;
            }
        }

        if (userName) {
            const existingUserName = await User.findOne({
                user_name: userName,
                _id: { $ne: userId }
            });
            if (existingUserName) {
                res.status(400).json({ message: 'Username is already taken' });
                return;
            }
        }

        user.first_name = firstName || user.first_name;
        user.last_name = lastName || user.last_name;
        user.email = email || user.email;
        user.user_name = userName || user.user_name;
        user.user_role = userRole || user.user_role;
        user.preferences = preferences || user.preferences;

        await user.save();

        const userResponse = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            user_name: user.user_name,
            user_role: user.user_role,
            preferences: user.preferences
        };

        res.status(200).json({ 
            message: 'User  details updated successfully', 
            user: userResponse });
    } catch (error) {
        console.error('Error updating user details:', error);
        next(error);
    }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User  not found' });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({
                message: 'Password must be at least 8 characters long, ' +
                    'contain at least one uppercase letter, ' +
                    'one lowercase letter, one number, ' +
                    'and one special character'
            });
            return;
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            res.status(400).json({ message: 'New password cannot be the same as the current password' });
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        next(error);
    }
};