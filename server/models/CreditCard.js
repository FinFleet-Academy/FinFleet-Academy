import mongoose from 'mongoose';

const creditCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true }, 
  type: { type: String, enum: ['Travel', 'Rewards', 'Cashback', 'Fuel', 'Premium'], required: true },
  annualFee: { type: Number, default: 0 },
  apr: { type: Number, required: true }, 
  rewardRate: { type: Number, required: true }, 
  minIncome: { type: Number, required: true },
  creditScoreRange: { type: String, default: '750+' },
  benefits: [String],
  affiliateLink: { type: String, required: true },
  isPromoted: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

export default mongoose.model('CreditCard', creditCardSchema);
