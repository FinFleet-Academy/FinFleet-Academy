import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'FREE' },
  isAdmin: { type: Boolean, default: false },
  chatCount: { type: Number, default: 0 },
  lastChatReset: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
