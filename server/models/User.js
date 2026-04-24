import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'FREE' },
  isAdmin: { type: Boolean, default: false },
  chatCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.index({ plan: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ email: 1 }); // Ensuring email index explicitly

export default mongoose.model('User', userSchema);
