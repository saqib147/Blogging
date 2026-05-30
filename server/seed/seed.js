import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import {
  users,
  blogs,
  followGraph,
  likes,
  bookmarks,
  adminUser,
  SEED_PASSWORD,
} from './seedData.js';

dotenv.config();

async function clearSeedData() {
  const seedUsers = await User.find({
    email: { $regex: /@seed\.ink-echo\.app$/ },
  });
  const seedUserIds = seedUsers.map((u) => u._id);

  if (seedUserIds.length === 0) {
    console.log('No existing seed data found.');
    return;
  }

  await Comment.deleteMany({
    $or: [{ author: { $in: seedUserIds } }, { blogId: { $in: await Blog.find({ author: { $in: seedUserIds } }).distinct('_id') } }],
  });
  await Blog.deleteMany({ author: { $in: seedUserIds } });
  await User.deleteMany({ _id: { $in: seedUserIds } });

  console.log(`Cleared ${seedUserIds.length} seed users and their content.`);
}

async function seed() {
  await connectDB();

  try {
    await clearSeedData();

    console.log('Creating admin user...');
    await User.deleteOne({ email: adminUser.email });
    await User.create(adminUser);

    console.log('Creating users...');
    const userDocs = await User.create(users);
    const userByEmail = Object.fromEntries(userDocs.map((u) => [u.email, u]));

    console.log('Setting up follows...');
    for (const [email, followingEmails] of Object.entries(followGraph)) {
      const user = userByEmail[email];
      user.following = followingEmails.map((e) => userByEmail[e]._id);
      await user.save();

      for (const followingEmail of followingEmails) {
        const followed = userByEmail[followingEmail];
        if (!followed.followers.some((id) => id.equals(user._id))) {
          followed.followers.push(user._id);
          await followed.save();
        }
      }
    }

    console.log('Creating blogs...');
    const blogDocs = [];
    for (const blog of blogs) {
      const author = userByEmail[blog.authorEmail];
      if (!author) {
        throw new Error(`Unknown author email: ${blog.authorEmail}`);
      }

      const doc = await Blog.create({
        title: blog.title,
        content: blog.content.trim(),
        coverImage: blog.coverImage,
        author: author._id,
        tags: blog.tags,
        category: blog.category,
        status: blog.status,
      });
      blogDocs.push(doc);
    }

    const blogByTitle = Object.fromEntries(blogDocs.map((b) => [b.title, b]));

    console.log('Applying likes and bookmarks...');
    for (const [email, titles] of Object.entries(likes)) {
      const user = userByEmail[email];
      for (const title of titles) {
        const blog = blogByTitle[title];
        if (blog && !blog.likes.some((id) => id.equals(user._id))) {
          blog.likes.push(user._id);
        }
      }
    }

    for (const [email, titles] of Object.entries(bookmarks)) {
      const user = userByEmail[email];
      for (const title of titles) {
        const blog = blogByTitle[title];
        if (blog && !blog.bookmarks.some((id) => id.equals(user._id))) {
          blog.bookmarks.push(user._id);
        }
      }
    }

    await Promise.all(blogDocs.map((b) => b.save()));

    console.log('Adding sample comments...');
    const lisbonBlog = blogByTitle["48 Hours in Lisbon: A Photographer's Field Guide"];
    const writingBlog = blogByTitle['The Case for Writing by Hand in a Digital Age'];

    if (lisbonBlog) {
      const parent = await Comment.create({
        blogId: lisbonBlog._id,
        author: userByEmail['james@seed.ink-echo.app']._id,
        text: 'This is exactly the guide I needed before my trip last spring. Miradouro da Senhora do Monte at sunrise is unbeatable.',
      });
      const reply = await Comment.create({
        blogId: lisbonBlog._id,
        author: userByEmail['elena@seed.ink-echo.app']._id,
        text: 'Saving this for my October trip. Did you find a favorite pastel de nata spot?',
        parentComment: parent._id,
      });
      parent.replies.push(reply._id);
      await parent.save();
    }

    if (writingBlog) {
      await Comment.create({
        blogId: writingBlog._id,
        author: userByEmail['marcus@seed.ink-echo.app']._id,
        text: 'Switched to a notebook for architecture notes last month. My diagrams are messier but my decisions are clearer.',
      });
    }

    const published = blogDocs.filter((b) => b.status === 'published').length;
    console.log('\nSeed complete!');
    console.log(`  Users:    ${userDocs.length}`);
    console.log(`  Blogs:    ${blogDocs.length} (${published} published, ${blogDocs.length - published} draft)`);
    console.log(`  Comments: 2 threads`);
    console.log('\nLogin with any seed account:');
    console.log(`  ${adminUser.email}  /  ${SEED_PASSWORD}  (admin)`);
    users.forEach((u) => console.log(`  ${u.email}  /  ${SEED_PASSWORD}`));
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

seed();
