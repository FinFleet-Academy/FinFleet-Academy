import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  averagePrice: { type: Number, default: 0 },
}, { timestamps: true });

portfolioItemSchema.index({ user: 1, symbol: 1 }, { unique: true });

export default mongoose.model('PortfolioItem', portfolioItemSchema);
