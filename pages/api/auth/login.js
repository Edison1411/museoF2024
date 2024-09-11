import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import rateLimit from 'express-rate-limit';

// Rate limiter configuration 
const loginLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 2, 
  keyGenerator: (req) => req.body.email, 
  message: 'Too many login attempts. Please try again after 10 seconds.',
});

export default async function handler(req, res) {
  // Apply rate limiter
  loginLimiter(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password } = req.body;

    try {
      await connectToDatabase();
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });
}
