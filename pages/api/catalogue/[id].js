import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth'; // Importar la función de verificación de tokens

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.headers.authorization?.split(' ')[1];

  // Verificar si el token está presente y es válido
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is required' });
  }

  let decodedToken;
  try {
    decodedToken = verifyToken(token); // Verificar el token
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  switch (method) {
    case 'GET':
      try {
        // Obtener el ítem específico
        const item = await prisma.catalogueItem.findUnique({
          where: { id: parseInt(id) },
        });
        if (item) {
          res.status(200).json(item);
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Error fetching item' });
      }
      break;

    case 'PUT':
      // Verificar si el rol del usuario le permite actualizar el ítem
      if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'ADMIN_READ') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      try {
        // Actualizar el ítem
        const updatedItem = await prisma.catalogueItem.update({
          where: { id: parseInt(id) },
          data: req.body,
        });
        res.status(200).json(updatedItem);
      } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item' });
      }
      break;

    case 'DELETE':
      // Solo el rol ADMIN puede borrar un ítem
      if (decodedToken.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      try {
        await prisma.catalogueItem.delete({
          where: { id: parseInt(id) },
        });
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
      }
      break;

    default:
      // Manejar métodos no permitidos
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
