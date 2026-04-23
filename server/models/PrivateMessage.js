import mongoose from 'mongoose';

const privateMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
}, { timestamps: true });

privateMessageSchema.index({ sender: 1, receiver: 1 });

export default mongoose.model('PrivateMessage', privateMessageSchema);
