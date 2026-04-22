import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  icon: { 
    type: String, 
    default: 'BookOpen' 
  },
  color: { 
    type: String, 
    default: 'text-brand-600' 
  },
  bg: { 
    type: String, 
    default: 'bg-brand-100' 
  },
  category: {
    type: String,
    default: 'Trading'
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
