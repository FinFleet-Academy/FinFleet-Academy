import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '0:00'
  },
  notes: {
    type: String, // Rich text / HTML
    default: ''
  },
  aiSummary: {
    type: String,
    default: ''
  },
  hasQuiz: {
    type: Boolean,
    default: false
  },
  quiz: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }
  ],
  order: {
    type: Number,
    required: true
  },
  isFreePreview: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure unique ordering within a course
lessonSchema.index({ courseId: 1, order: 1 });

export default mongoose.model('Lesson', lessonSchema);
