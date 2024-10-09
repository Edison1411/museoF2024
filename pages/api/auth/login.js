import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Para comparar contraseñas
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    console.log('Attempting to find user:', username);
    const user = await prisma.user.findUnique({ 
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true
      }
    });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Registrar el intento de inicio de sesión exitoso
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        status: 'SUCCESS',
        details: 'User logged in successfully',
      },
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
