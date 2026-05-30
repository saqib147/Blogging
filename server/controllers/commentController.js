import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getBlogComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.id, parentComment: null })
    .populate('author', 'name avatar')
    .populate({
      path: 'replies',
      populate: { path: 'author', select: 'name avatar' },
      options: { sort: { createdAt: 1 } },
    })
    .sort({ createdAt: -1 });

  res.json(comments);
});

export const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const comment = await Comment.create({
    blogId: req.params.id,
    author: req.user._id,
    text: text.trim(),
  });

  const populated = await comment.populate('author', 'name avatar');
  res.status(201).json(populated);
});

export const createReply = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    res.status(400);
    throw new Error('Reply text is required');
  }

  const parentComment = await Comment.findById(req.params.id);
  if (!parentComment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const reply = await Comment.create({
    blogId: parentComment.blogId,
    author: req.user._id,
    text: text.trim(),
    parentComment: parentComment._id,
  });

  parentComment.replies.push(reply._id);
  await parentComment.save();

  const populated = await reply.populate('author', 'name avatar');
  res.status(201).json(populated);
});

export const getReplies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [replies, total] = await Promise.all([
    Comment.find({ parentComment: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ parentComment: req.params.id }),
  ]);

  res.json({ replies, page, pages: Math.ceil(total / limit), total });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate('blogId');

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const blog = await Blog.findById(comment.blogId);
  const isCommentAuthor = comment.author.toString() === req.user._id.toString();
  const isBlogAuthor = blog && blog.author.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isBlogAuthor) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
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
