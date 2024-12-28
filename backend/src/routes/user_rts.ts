import express, { Request, Response, NextFunction, RequestHandler } from 'express'
import { changePassword, getUserDetails, searchUsers, updateUserDetails } from '../controllers/user_ctrl'
import { authMiddleWare } from '../middleware/auth_middleware';

const router = express.Router()

const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/search',  authMiddleWare, asyncHandler(searchUsers));
router.get('/details', authMiddleWare, asyncHandler(getUserDetails));
router.put('/update', authMiddleWare, asyncHandler(updateUserDetails));
router.put('/change_password', authMiddleWare, asyncHandler(changePassword));

export default router;