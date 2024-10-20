import { Request, Response, NextFunction } from "express";
import CalendarEvent, { ICalendarEvent } from "../models/event_mdls";

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const events = await CalendarEvent.find();
        res.json(events);
    } catch (error) {
        next(error);
    }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newEvent: ICalendarEvent = new CalendarEvent(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedEvent = await CalendarEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedEvent) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.json(updatedEvent);
    } catch (error) {
      next(error);
    }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedEvent = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};