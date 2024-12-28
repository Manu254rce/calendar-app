import express from 'express';
import { getAllUsers, deleteUser , getUserEvents, toggleAdminStatus, searchUser, getUserDetails } from '../controllers/admin_ctrl';
import { authMiddleWare } from '../middleware/auth_middleware';
import { adminMiddleWare } from '../middleware/admin_middleware'

const router = express.Router();

// Middleware to protect admin routes
router.use(authMiddleWare);
router.use(adminMiddleWare);

// Get all users
router.get('/users', getAllUsers);

// Delete a user
router.delete('/users/:id', deleteUser );

// Get events for a specific user
router.get('/users/:id/events', getUserEvents);

// Change user's admin status
router.put('/users/:id', toggleAdminStatus);

// Search for a user
router.get('/users/search', searchUser);

//  Get user details
router.get('/users/:id/details', getUserDetails);

export default router;