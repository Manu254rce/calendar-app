import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, searchEvents, getTagSuggestions } from '../controllers/event_ctrl';
import { authMiddleWare } from '../middleware/auth_middleware';

const router = express.Router();

const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authMiddleWare)

// Get all events 
router.get('/', asyncHandler(getEvents));

// Create a new event
router.post('/', asyncHandler(createEvent));

// Update an event
router.put('/:id', asyncHandler(updateEvent));

// Delete an event
router.delete('/:id', asyncHandler(deleteEvent));

// Search events
router.get('/search', asyncHandler(searchEvents));

// Get tag suggestions
router.get('/tags', asyncHandler(getTagSuggestions));

export default router;