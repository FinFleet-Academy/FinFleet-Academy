import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['course', 'news', 'chat'], required: true },
  contentId: { type: String, required: true }, // ID of the news/course, or chat response text
  metadata: {
    title: { type: String }, // optional, useful for quick rendering
    summary: { type: String },
    link: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('Bookmark', bookmarkSchema);
