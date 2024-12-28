import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from 'types/user_types';
import Comment from '../models/comment_mdls';
import User from '../models/user_mdls';

const router = express.Router();

const asyncHandler = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/events/:eventId/comments', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
  const { content } = req.body;
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const newComment = new Comment({
    eventId: new mongoose.Types.ObjectId(eventId),
    userId: new mongoose.Types.ObjectId(req.user.id),
    userName: user.user_name,
    text: content,
    createdAt: new Date()
  });

  await newComment.save();

  res.status(201).json(newComment);
}));

router.get('/events/:eventId/comments', asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const comments = await Comment.find({ 
    eventId: new mongoose.Types.ObjectId(eventId) 
  })
    .sort({ createdAt: -1 }) 
    .limit(50);

  res.json(comments);
}));

router.delete('/comments/:commentId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { commentId } = req.params;

  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  if (comment.userId.toString() !== req.user.id) {
    res.status(403).json({ message: 'Not authorized to delete this comment' });
    return;
  }

  await Comment.findByIdAndDelete(commentId);

  res.json({ message: 'Comment deleted successfully' });
}));

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ 
    message: 'Server error', 
    error: err instanceof Error ? err.message : 'Unknown error' 
  });
});

export default router;