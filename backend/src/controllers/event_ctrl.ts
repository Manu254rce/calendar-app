import { Response, NextFunction } from "express";
import CalendarEvent, { ICalendarEvent } from "../models/event_mdls";
import mongoose from "mongoose";
import { sendEmail } from '../services/mailService';
import UserModel from '../models/user_mdls';
import { AuthRequest } from "types/user_types";

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

export const addUserToEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId, userId } = req.body;

  try {
      const event = await CalendarEvent.findById(eventId);

      if (!event) {
          res.status(404).json({ message: 'Event not found' });
          return;
      }

      // Check if the user is already a member
      if (event.members.includes(userId)) {
          res.status(400).json({ message: 'User  is already a member of this event' });
          return
        }

      // Add the user to the event's members
      event.members.push(userId);
      await event.save();

      // Fetch user details for User B (the one being added)
      const userB = await UserModel.findById(userId);

      if (!userB) {
          res.status(404).json({ message: 'User  not found' });
          return
        }

      // Send notification email to User B
      try {
        await sendEmail(
          userB.email,
          'You have been added to an event!',
          `You have been added to the event: ${event.title}`,
          `<h1>${event.title}</h1><p>You have been added to this event.</p>`
        );
      } catch (emailError) {
        console.error('Email Sending Failed:', emailError);
      
        res.status(200).json({ 
          message: 'User added to event, but email notification failed' 
        });
      }
  
      res.status(200).json({ message: 'User  added to event and notified via email' });
  } catch (error) {
      console.error('Error adding user to event:', error);
      next(error);
  }
};