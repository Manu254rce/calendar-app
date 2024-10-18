import express,  { Request, Response, NextFunction } from 'express'
import * as eventController from '../controllers/event'

const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    eventController.getEvents(req, res).catch(next);
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    eventController.createEvent(req, res).catch(next);
})

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    eventController.updateEvent(req, res).catch(next);
})

router.delete('/', (req: Request, res: Response, next: NextFunction) => {
    eventController.deleteEvent(req, res).catch(next);
})

export default router;