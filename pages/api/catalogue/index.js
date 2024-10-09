import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  // Extract token only for methods that require it (e.g., POST)
  const token = req.headers.authorization?.split(' ')[1];

  // Handle methods that require authentication
  if (method === 'POST') {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token is required' });
    }

    let decodedToken;
    try {
      decodedToken = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'ADMIN2') {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  }

  switch (method) {
    case 'GET':
      try {
        const { page = 1, search = '' } = req.query;
        const ITEMS_PER_PAGE = 6;

        const skip = (parseInt(page) - 1) * ITEMS_PER_PAGE;

        // Build search filter
        const where = search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {};

        // Fetch data and total count concurrently
        const [items, total] = await Promise.all([
          prisma.catalogueItem.findMany({
            where,
            skip,
            take: ITEMS_PER_PAGE,
          }),
          prisma.catalogueItem.count({ where }),
        ]);

        res.status(200).json({ items, total, page: parseInt(page), itemsPerPage: ITEMS_PER_PAGE });
      } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
      }
      break;

    case 'POST':
      if (decodedToken.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      try {
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
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}