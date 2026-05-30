import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalBlogs, totalComments, publishedBlogs, draftBlogs, blogs] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Comment.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Blog.countDocuments({ status: 'draft' }),
    Blog.find({}, 'likes bookmarks'),
  ]);

  const totalLikes = blogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
  const totalBookmarks = blogs.reduce((acc, b) => acc + (b.bookmarks?.length || 0), 0);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [newUsersWeek, newBlogsWeek] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Blog.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);

  res.json({
    totalUsers,
    totalBlogs,
    totalComments,
    publishedBlogs,
    draftBlogs,
    totalLikes,
    totalBookmarks,
    newUsersWeek,
    newBlogsWeek,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const postsCount = await Blog.countDocuments({ author: u._id });
      return { ...u.toObject(), role: u.role || 'user', postsCount };
    })
  );

  res.json(usersWithStats);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Role must be user or admin');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
    res.status(400);
    throw new Error('You cannot remove your own admin access');
  }

  user.role = role;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }

  const authorBlogs = await Blog.find({ author: user._id });
  const blogIds = authorBlogs.map((b) => b._id);

  await Comment.deleteMany({
    $or: [{ author: user._id }, { blogId: { $in: blogIds } }],
  });

  await Blog.deleteMany({ author: user._id });

  await User.updateMany(
    { $or: [{ followers: user._id }, { following: user._id }] },
    { $pull: { followers: user._id, following: user._id } }
  );

  await User.deleteOne({ _id: user._id });

  res.json({ message: 'User and all their content deleted successfully' });
});

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(blogs);
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['draft', 'published'].includes(status)) {
    res.status(400);
    throw new Error('Status must be draft or published');
  }

  const blog = await Blog.findById(req.params.id).populate('author', 'name email avatar');
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  blog.status = status;
  await blog.save();

  res.json(blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const commentIds = await Comment.find({ blogId: blog._id }).distinct('_id');
  await Comment.deleteMany({
    $or: [{ blogId: blog._id }, { parentComment: { $in: commentIds } }],
  });
  await blog.deleteOne();

  res.json({ message: 'Blog and its associated comments deleted successfully' });
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate('author', 'name email avatar')
    .populate('blogId', 'title')
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(comments);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: comment._id },
    });
  }

  await Comment.deleteMany({ parentComment: comment._id });
  await comment.deleteOne();

  res.json({ message: 'Comment deleted successfully' });
});
