// authServer.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-long-secret-key-replace-in-production';


// In-memory user store (replace with a database in production)
const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: '$2b$10$zxGggaYiiiJjMmu2UFWG8.kM8zXu7RmqK5U9gLOZrwXmshjYJWNYO', // hashed 'adminPass123'
    role: 'ADMIN'
  }
];
console.log(users);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = users.find(u => u.username === username);
    if (!user) { // <--- Add this check here
        return res.status(401).json({ message: 'User not found' });
      }
      if (!(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

const PORT = process.env.AUTH_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Server running on port ${PORT}`);
});