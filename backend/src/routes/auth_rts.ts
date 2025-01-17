import express, { Request, Response } from 'express'
import { register, login, logout } from '../controllers/auth_ctrl'

const router = express.Router();

const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
    return async (req: Request, res: Response) => {
        try {
            await fn(req, res);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occured'
            })
        }
    }
};

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', logout)

export default router;