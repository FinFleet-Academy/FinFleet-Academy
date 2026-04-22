import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['course', 'news'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true, maxlength: 1000 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
