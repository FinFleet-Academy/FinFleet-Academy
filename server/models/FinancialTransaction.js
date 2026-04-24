import mongoose from 'mongoose';

const financialTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Salary', 'Freelance', 'Investment', 'Rent', 'Food', 'Transport', 'Shopping', 'Utilities', 'Lifestyle', 'Other'],
    required: true 
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
  isRecurring: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('FinancialTransaction', financialTransactionSchema);
