import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const postsCount = await Blog.countDocuments({ author: user._id, status: 'published' });

  // Check if the requesting user is following this profile
  const isFollowing = req.user
    ? user.followers.some((fId) => fId.toString() === req.user._id.toString())
    : false;

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    postsCount,
    isFollowing,
    createdAt: user.createdAt,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  const { name, bio, avatar } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
  });
});

export const getUserLikedPosts = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ likes: req.params.id, status: 'published' })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(blogs);
});

export const getUserBookmarkedPosts = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ bookmarks: req.params.id, status: 'published' })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(blogs);
});

export const getUserPublishedPosts = asyncHandler(async (req, res) => {
  const query = { author: req.params.id };
  const isOwner = req.user && req.user._id.toString() === req.params.id;

  if (!isOwner) {
    query.status = 'published';
  }

  const blogs = await Blog.find(query)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(blogs);
});

export const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id.toString();

  if (targetId === currentUserId) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const [targetUser, currentUser] = await Promise.all([
    User.findById(targetId),
    User.findById(currentUserId),
  ]);

  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const alreadyFollowing = targetUser.followers.some(
    (fId) => fId.toString() === currentUserId
  );

  if (alreadyFollowing) {
    res.status(400);
    throw new Error('Already following this user');
  }

  targetUser.followers.push(currentUserId);
  currentUser.following.push(targetId);

  await Promise.all([targetUser.save(), currentUser.save()]);

  res.json({
    followersCount: targetUser.followers.length,
    isFollowing: true,
  });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id.toString();

  if (targetId === currentUserId) {
    res.status(400);
    throw new Error('You cannot unfollow yourself');
  }

  const [targetUser, currentUser] = await Promise.all([
    User.findById(targetId),
    User.findById(currentUserId),
  ]);

  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  targetUser.followers = targetUser.followers.filter(
    (fId) => fId.toString() !== currentUserId
  );
  currentUser.following = currentUser.following.filter(
    (fId) => fId.toString() !== targetId
  );

  await Promise.all([targetUser.save(), currentUser.save()]);

  res.json({
    followersCount: targetUser.followers.length,
    isFollowing: false,
  });
});

export const getUserFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('followers')
    .populate('followers', '_id name avatar bio');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.followers);
});

export const getUserFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('following')
    .populate('following', '_id name avatar bio');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.following);
});
