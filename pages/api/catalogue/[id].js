import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is required' });
  }

  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  if (method === 'PUT') {
    if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'ADMIN_READ') {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    try {
      const { isVisible } = req.body;
      
      if (typeof isVisible !== 'boolean') {
        return res.status(400).json({ message: 'Bad Request: isVisible must be a boolean' });
      }

      const updatedItem = await prisma.catalogueItem.update({
        where: { id: parseInt(id) },
        data: { isVisible },
      });

      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Error updating item', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}