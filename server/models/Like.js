import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId:   { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['course', 'news', 'comment', 'announcement'], required: true },
}, { timestamps: true });

// Unique constraint: one user, one like per target
likeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
