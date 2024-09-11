// pages/api/auth/register.js
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { name, email, password, role } = req.body;

  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database.");

    console.log(`Checking if user with email ${email} already exists...`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists.");
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log("Creating new user...");
    const user = await User.create({ name, email, password, role });
    console.log("User created successfully:", user);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in register handler:", error);
    res.status(500).json({ message: 'Error registering user', details: error.toString() });
  }
}