import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserLikedPosts,
  getUserBookmarkedPosts,
  getUserPublishedPosts,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id', optionalAuth, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/posts', optionalAuth, getUserPublishedPosts);
router.get('/:id/liked', getUserLikedPosts);
router.get('/:id/bookmarks', getUserBookmarkedPosts);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);

export default router;
