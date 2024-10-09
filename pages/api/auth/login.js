// pages/api/auth/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Para comparar contraseñas
import jwt from 'jsonwebtoken'; // Importa jwt para generar el token
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();

// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5, // 5 intentos cada 10 segundos
  keyGenerator: (req) => req.body.username,
  message: 'Too many login attempts. Please try again after 10 seconds.',
});

export default async function handler(req, res) {
  // Asegúrate de que limitador de peticiones esté funcionando y no esté bloqueando sin enviar respuesta
  loginLimiter(req, res, async () => {
    if (req.method !== 'POST') {
      // Siempre debe haber una respuesta en caso de que el método HTTP no sea permitido
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { username, password } = req.body;

    try {
      // Buscar al usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { username },
      });

      // Verifica si el usuario existe y si la contraseña es correcta
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // Si el login falla, registrar el intento
        await prisma.auditLog.create({
          data: {
            userId: user?.id || null,
            action: 'LOGIN_ATTEMPT',
            status: 'FAILED',
            details: 'Invalid username or password',
          },
        });

        // Devolver respuesta 401 para indicar que las credenciales son incorrectas
        return res.status(401).json({ message: 'Invalid username or password' });
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

      // Generar el token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET, // Asegúrate de que esta variable de entorno esté configurada
        { expiresIn: '1h' }
      );

      // Enviar respuesta con los datos del usuario y el token
      return res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role,
        token, // Incluye el token en la respuesta
      });
    } catch (error) {
      console.error('Login error:', error);

      // Enviar respuesta con el error si ocurre algún fallo en el try-catch
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      // Asegurarse de cerrar la conexión a la base de datos después de cada solicitud
      await prisma.$disconnect();
    }
  });
}
