import { Router } from 'express';
import { createReply, getReplies, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/:id/replies', protect, createReply);
router.get('/:id/replies', getReplies);
router.delete('/:id', protect, deleteComment);

export default router;
