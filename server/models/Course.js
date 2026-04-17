import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: 'BookOpen' }, // lucide-react icon name as a string
  color: { type: String, default: 'text-blue-600' },
  bg: { type: String, default: 'bg-blue-100' }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
