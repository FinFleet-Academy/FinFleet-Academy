import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentId: { type: String },
  orderId: { type: String },
  signature: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
