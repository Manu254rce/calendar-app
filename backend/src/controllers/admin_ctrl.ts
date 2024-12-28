import { Request, Response, NextFunction } from 'express';
import User from '../models/user_mdls';
import CalendarEvent from '../models/event_mdls';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const deleteUser  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getUserEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const events = await CalendarEvent.find({ user: id });
        res.json(events);
    } catch (error) {
        next(error);
    }
};

export const toggleAdminStatus = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) { 
            res.status(404).json({ message: 'User not found' })
            return;
        }
        user.isAdmin = !user.isAdmin;
        await user.save();
        res.status(200).json({ message: 'User admin status updated', user });
    } catch (error) {
        next(error);
    }
}

export const searchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const getUserDetails = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId)
        .select('-password')
        // .populate({
        //   path: 'events',
        //   select: 'title date description'
        // })
        // .populate({
        //   path: 'comments',
        //   select: 'text eventTitle createdAt',
        //   populate: {
        //     path: 'event',
        //     select: 'title'
        //   }
        // });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details', error });
    }
  }