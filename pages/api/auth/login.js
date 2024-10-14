import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();

// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 segundos
  max: 3, // Máximo de 3 intentos
  keyGenerator: (req) => req.body.username,
  message: 'Too many login attempts. Please try again after 10 seconds.',
});

// Función para verificar si estamos dentro del horario permitido
const isWithinAllowedTime = () => {
  const currentTime = new Date().getHours();
  return currentTime >= 13 && currentTime < 16;
};

export default async function handler(req, res) {
  // Limitar intentos de login (aplica para cualquier solicitud al endpoint)
  loginLimiter(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { username, password } = req.body;

    try {
      // Verificar si estamos dentro del horario permitido ANTES de consultar en la BD
      if (!isWithinAllowedTime()) {
        return res.status(403).json({
          message: 'Access denied: You can only log in between 1 PM (13:00) and 4 PM (16:00).',
        });
      }

      // Buscar al usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { username },
      });

      // Verificar si el usuario existe y si la contraseña es correcta
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // Registrar intento de login fallido
        await prisma.auditLog.create({
          data: {
            userId: user?.id || null,
            action: 'LOGIN_ATTEMPT',
            status: 'FAILED',
            details: 'Failed to log in',
          },
        });

        return res.status(401).json({ message: 'Failed to log in' });
      }

      // Si el login es exitoso, registrar el intento exitoso
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_ATTEMPT',
          status: 'SUCCESS',
          details: 'User successfully logged in',
        },
      });

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  });
}
