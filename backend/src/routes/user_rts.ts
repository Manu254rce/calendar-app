import express, { Request, Response, NextFunction, RequestHandler } from 'express'
import { getUserDetails, searchUsers } from '../controllers/user_ctrl'

const router = express.Router()

const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/search', asyncHandler(searchUsers));
router.get('/details', asyncHandler(getUserDetails));

export default router;