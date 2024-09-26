import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth'; // Importar la función de verificación de tokens

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const token = req.headers.authorization?.split(' ')[1];

  // Verificar el token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is required' });
  }

  let decodedToken;
  try {
    decodedToken = verifyToken(token); // Verificar si el token es válido
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  switch (method) {
    case 'GET':
      try {
        // Obtener todos los elementos del catálogo
        const items = await prisma.catalogueItem.findMany();
        res.status(200).json(items);
      } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
      }
      break;

    case 'POST':
      // Verificar si el usuario tiene el rol adecuado
      if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'ADMIN2') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      try {
        // Crear un nuevo elemento en el catálogo
        const newItem = await prisma.catalogueItem.create({
          data: req.body,
        });
        res.status(201).json(newItem);
      } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Error creating item' });
      }
      break;

    default:
      // Si el método HTTP no es GET o POST, devolver error 405
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
