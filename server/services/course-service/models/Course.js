import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String, required: true },
  icon: { type: String, default: 'BookOpen' },
  category: { type: String, default: 'Trading', index: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
