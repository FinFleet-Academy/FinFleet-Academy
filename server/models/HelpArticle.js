import mongoose from 'mongoose';

const helpArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown supported
  category: { type: String, required: true, index: true },
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

export default mongoose.model('HelpArticle', helpArticleSchema);
