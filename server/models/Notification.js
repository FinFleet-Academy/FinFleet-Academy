import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  userEmail: { type: String, required: true }, // 'ALL' for broadcasts
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['broadcast', 'follow', 'like', 'comment', 'system', 'achievement'],
    default: 'broadcast'
  },
  targetId: { type: String }, // e.g., commentId, courseId, userId
  targetType: { type: String }, // e.g., 'comment', 'course', 'user'
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
