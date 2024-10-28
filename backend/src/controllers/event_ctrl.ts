import { Request, Response, NextFunction } from "express";
import CalendarEvent, { ICalendarEvent } from "../models/event_mdls";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: { userId: string }
}

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await CalendarEvent.find({ user: req.user?.userId });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newEvent: ICalendarEvent = new CalendarEvent({
      ...req.body, user: req.user?.userId
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      req.body,
      { new: true });
    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedEvent = await CalendarEvent.findByIdAndDelete(
      {
        _id: req.params.id,
        user: req.user?.userId
      }
    );
    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const searchEvents = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query, searchType } = req.query;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    let searchQuery: any = { user: userId }

    if (searchType === 'tag') {
      searchQuery = {
        user: userId,
        tags: { $regex: query, $options: 'i' } }
    } else {
      searchQuery = {
        user: userId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
        ]
      }
    }

    const events = await CalendarEvent.find(searchQuery);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getTagSuggestions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string;
    const userId = req.user?.userId

    if  (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)

    const matchingTags = await CalendarEvent.aggregate([
      { $match: { user: userObjectId } },
      { $unwind: '$tags' },
      { $match:  { 'tags': { $regex: search, $options: 'i' } } },
      { $group: { _id: '$tags' } },
      { $limit: 10 },
      { $project: { _id: 0, tag: "$_id" } }
    ])

    res.json(matchingTags.map(t => t.tag))
  } catch (error) {
    next(error);
  }
}
