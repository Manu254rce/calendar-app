import { Request, Response } from "express";
import CalendarEvent, { ICalendarEvent } from "../models/Event";

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await CalendarEvent.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        const newEvent: ICalendarEvent = new CalendarEvent(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid event data' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
      const updatedEvent = await CalendarEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: 'Invalid event data' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
