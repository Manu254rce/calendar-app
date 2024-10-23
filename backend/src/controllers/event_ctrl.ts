import { Request, Response, NextFunction } from "express";
import CalendarEvent, { ICalendarEvent } from "../models/event_mdls";

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
         {_id: req.params.id,
          user: req.user?.userId}
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