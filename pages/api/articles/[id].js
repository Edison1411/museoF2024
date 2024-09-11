import { connectToDatabase } from '../../../lib/mongodb';
import Article from '../../../models/Article';

export default async function handler(req, res) {
  const { method, query: { id } } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'PUT':
      try {
        const article = await Article.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!article) {
          return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
      } catch (error) {
        res.status(500).json({ message: 'Error updating article' });
      }
      break;

    case 'DELETE':
      try {
        const article = await Article.findByIdAndDelete(id);
        if (!article) {
          return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article deleted' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting article' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}