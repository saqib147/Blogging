import { Router } from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  bookmarkBlog,
  unbookmarkBlog,
  getCategoriesAndTags,
} from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/meta/categories-tags', getCategoriesAndTags);
router.get('/', optionalAuth, getBlogs);
router.get('/:id', optionalAuth, getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, likeBlog);
router.delete('/:id/like', protect, unlikeBlog);
router.post('/:id/bookmark', protect, bookmarkBlog);
router.delete('/:id/bookmark', protect, unbookmarkBlog);

export default router;
