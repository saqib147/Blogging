import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2] || process.env.ADMIN_EMAIL;

if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

async function makeAdmin() {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`Promoted ${user.name} (${user.email}) to admin.`);
  await mongoose.connection.close();
}

makeAdmin();
