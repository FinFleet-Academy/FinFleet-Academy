import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType:      { type: String, enum: ['course', 'news', 'announcement'], required: true },
  targetId:        { type: mongoose.Schema.Types.ObjectId, required: true },
  content:         { type: String, required: true, maxlength: 1000 },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likeCount:       { type: Number, default: 0 },
}, { timestamps: true });

commentSchema.index({ targetId: 1, targetType: 1 });

export default mongoose.model('Comment', commentSchema);
