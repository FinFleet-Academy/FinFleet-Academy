import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  market: { type: String, default: 'INDIA' },
}, { timestamps: true });

export default mongoose.model('Trade', tradeSchema);
