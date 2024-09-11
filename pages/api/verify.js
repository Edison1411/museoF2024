import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-long-secret-key-replace-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verification successful:', decoded);
    res.json({ valid: true, user: { id: decoded.userId, role: decoded.role } });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
}
