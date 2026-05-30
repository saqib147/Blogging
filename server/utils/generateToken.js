import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,           // must be true when sameSite is 'none'
  sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-site (Vercel ↔ Render)
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
