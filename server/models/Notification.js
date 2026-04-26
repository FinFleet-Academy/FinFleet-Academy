import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: [
      'announcement', 
      'course_update', 
      'system_alert', 
      'social', 
      'trading_alert', 
      'ai_signal'
    ],
    default: 'system_alert'
  },
  link: { 
    type: String, 
    default: '' 
  },
  targetType: { 
    type: String, 
    default: '' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  metadata: {
    asset: { type: String },
    action: { type: String },
    confidence: { type: Number },
    price: { type: Number },
    changePercent: { type: Number }
  }
}, { timestamps: true });

// Index for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
