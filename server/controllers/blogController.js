import Blog from '../models/Blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.author) {
    query.author = req.query.author;
    if (!req.user || req.user._id.toString() !== req.query.author) {
      query.status = 'published';
    }
  } else if (req.query.bookmarked === 'true' && req.user) {
    query.bookmarks = req.user._id;
    query.status = 'published';
  } else if (req.query.liked === 'true' && req.user) {
    query.likes = req.user._id;
    query.status = 'published';
  } else {
    query.status = 'published';
  }

  if (req.query.category) query.category = req.query.category;

  const tagParam = req.query.tags || req.query.tag;
  if (tagParam) {
    const tags = (Array.isArray(tagParam) ? tagParam : String(tagParam).split(','))
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 1) {
      query.tags = tags[0];
    } else if (tags.length > 1) {
      query.tags = { $all: tags };
    }
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const sort = req.query.sort || 'newest';
  let blogs;

  if (sort === 'popular') {
    blogs = await Blog.aggregate([
      { $match: query },
      { $addFields: { likesCount: { $size: { $ifNull: ['$likes', []] } } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, avatar: 1 } }],
        },
      },
      { $unwind: '$author' },
    ]);
  } else {
    const sortOption =
      sort === 'oldest' ? { createdAt: 1 } : sort === 'title' ? { title: 1 } : { createdAt: -1 };

    blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
  }

  const [total] = await Promise.all([
    Blog.countDocuments(query),
  ]);

  res.json({
    blogs,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name avatar bio');

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.status === 'draft') {
    if (!req.user || req.user._id.toString() !== blog.author._id.toString()) {
      res.status(404);
      throw new Error('Blog not found');
    }
  }

  const blogObj = blog.toObject();
  if (req.user) {
    blogObj.isLiked = blog.likes.some((id) => id.toString() === req.user._id.toString());
    blogObj.isBookmarked = blog.bookmarks.some((id) => id.toString() === req.user._id.toString());
  } else {
    blogObj.isLiked = false;
    blogObj.isBookmarked = false;
  }
  blogObj.likesCount = blog.likes.length;
  blogObj.bookmarksCount = blog.bookmarks.length;

  res.json(blogObj);
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, coverImage, tags, category, status } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const blog = await Blog.create({
    title,
    content,
    coverImage: coverImage || '',
    tags: tags || [],
    category: category || '',
    status: status || 'draft',
    author: req.user._id,
  });

  const populated = await blog.populate('author', 'name avatar');
  res.status(201).json(populated);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this blog');
  }

  const { title, content, coverImage, tags, category, status } = req.body;

  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (coverImage !== undefined) blog.coverImage = coverImage;
  if (tags !== undefined) blog.tags = tags;
  if (category !== undefined) blog.category = category;
  if (status !== undefined) blog.status = status;

  await blog.save();
  const populated = await blog.populate('author', 'name avatar');
  res.json(populated);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this blog');
  }

  await blog.deleteOne();
  res.json({ message: 'Blog deleted successfully' });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const userId = req.user._id.toString();
  const alreadyLiked = blog.likes.some((id) => id.toString() === userId);

  if (!alreadyLiked) {
    blog.likes.push(req.user._id);
    await blog.save();
  }

  res.json({ likesCount: blog.likes.length, isLiked: true });
});

export const unlikeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
  await blog.save();

  res.json({ likesCount: blog.likes.length, isLiked: false });
});

export const bookmarkBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const userId = req.user._id.toString();
  const alreadyBookmarked = blog.bookmarks.some((id) => id.toString() === userId);

  if (!alreadyBookmarked) {
    blog.bookmarks.push(req.user._id);
    await blog.save();
  }

  res.json({ bookmarksCount: blog.bookmarks.length, isBookmarked: true });
});

export const unbookmarkBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  blog.bookmarks = blog.bookmarks.filter((id) => id.toString() !== req.user._id.toString());
  await blog.save();

  res.json({ bookmarksCount: blog.bookmarks.length, isBookmarked: false });
});

export const getCategoriesAndTags = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).select('category tags');

  const categories = {};
  const tags = {};

  blogs.forEach((blog) => {
    if (blog.category) {
      categories[blog.category] = (categories[blog.category] || 0) + 1;
    }
    blog.tags.forEach((tag) => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });

  res.json({
    categories: Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    tags: Object.entries(tags)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
  });
});
