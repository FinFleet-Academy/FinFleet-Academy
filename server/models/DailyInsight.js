import mongoose from 'mongoose';

const dailyInsightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true, unique: true },
  type: { type: String, enum: ['market_tip', 'investing_advice', 'crypto'], default: 'market_tip' }
}, { timestamps: true });

export default mongoose.model('DailyInsight', dailyInsightSchema);
