import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/event_ctrl';

const router = express.Router();

// Helper function to wrap async route handlers
const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all events 
router.get('/', asyncHandler(getEvents));

// Create a new event
router.post('/', asyncHandler(createEvent));

// Update an event
router.put('/:id', asyncHandler(updateEvent));

// Delete an event
router.delete('/:id', asyncHandler(deleteEvent));

export default router;