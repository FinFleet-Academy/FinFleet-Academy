import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['BUG', 'ACCOUNT', 'PAYMENT', 'GENERAL', 'OTHER'], 
    default: 'GENERAL' 
  },
  status: { type: String, enum: ['OPEN', 'PENDING', 'RESOLVED'], default: 'OPEN' },
  adminNotes: { type: String }
}, { timestamps: true });

export default mongoose.model('SupportMessage', supportMessageSchema);
