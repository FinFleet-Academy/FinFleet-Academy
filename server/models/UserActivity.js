import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'LOGIN', 'PAGE_VIEW', 'TRADE_EXECUTED', 'QUIZ_COMPLETED'
  metadata: { type: mongoose.Schema.Types.Mixed }, // flexible data like { page: '/dashboard' } or { symbol: 'AAPL', type: 'BUY' }
}, { timestamps: true });

export default mongoose.model('UserActivity', userActivitySchema);
