import mongoose from 'mongoose';

const financialProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Aggregated Investments
  investments: [{
    type: { type: String, enum: ['SIP', 'Mutual Fund', 'Stock', 'FD', 'Gold'], required: true },
    investedAmount: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
  }],

  // Debt & Loans
  loans: [{
    loanType: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    paidMonths: { type: Number, default: 0 },
    interestRate: { type: Number }
  }],

  // Metadata for AI Insights
  riskTolerance: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
  financialGoals: [String],

}, { timestamps: true });

export default mongoose.model('FinancialProfile', financialProfileSchema);
