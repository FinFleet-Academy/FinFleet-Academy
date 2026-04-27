import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  quizScores: {
    type: Map,
    of: Number, // lessonId -> score
    default: {}
  },
  lastWatchedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed'],
    default: 'enrolled'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
