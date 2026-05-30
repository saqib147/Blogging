import { Router } from 'express';
import { getBlogComments, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id/comments', getBlogComments);
router.post('/:id/comments', protect, createComment);

export default router;
