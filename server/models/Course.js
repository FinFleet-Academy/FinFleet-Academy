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
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Trading',
    index: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Pro'],
    default: 'Beginner'
  },
  accessPlan: {
    type: String,
    enum: ['free', 'prime', 'elite'],
    default: 'free'
  },
  instructor: {
    type: String,
    default: 'FinFleet Academy'
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
