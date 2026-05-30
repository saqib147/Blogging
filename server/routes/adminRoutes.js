import { Router } from 'express';
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getBlogs,
  updateBlogStatus,
  deleteBlog,
  getComments,
  deleteComment,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/blogs', getBlogs);
router.put('/blogs/:id/status', updateBlogStatus);
router.delete('/blogs/:id', deleteBlog);
router.get('/comments', getComments);
router.delete('/comments/:id', deleteComment);

export default router;
