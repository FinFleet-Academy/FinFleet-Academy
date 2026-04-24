import mongoose from 'mongoose';

const financialOfferSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, enum: ['Personal Loan', 'Home Loan', 'Saving Account', 'Demat Account', 'Insurance'], required: true },
  partnerName: { type: String, required: true },
  description: { type: String },
  maxAmount: { type: Number }, 
  interestRate: { type: Number },
  benefits: [String],
  trackingUrl: { type: String, required: true },
  payoutAmount: { type: Number }, 
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('FinancialOffer', financialOfferSchema);
