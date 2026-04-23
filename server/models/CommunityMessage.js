import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxlength: 1000 },
  userName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('CommunityMessage', messageSchema);
