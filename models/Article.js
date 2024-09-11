// models/Article.js
import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  codigoColeccionista: { type: String, required: true },
  codigoSipce: { type: String, required: true },
  codigoUbicacion: { type: String, required: true },
  filiacionCultural: { type: String, required: true },
  dimensiones: { type: String, required: true },
  details: { type: String, required: true },
  relatedImages: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);