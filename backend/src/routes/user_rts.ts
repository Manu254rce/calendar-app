import express from 'express'
import { searchUsers } from '../controllers/user_ctrl'

const router = express.Router()

router.get('/search', searchUsers)

export default router;