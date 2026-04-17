import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // 'ALL' for broadcasts
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
