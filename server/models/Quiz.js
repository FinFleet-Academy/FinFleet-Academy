import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'General Finance' },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // index of options
    explanation: { type: String }
  }],
  points: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
