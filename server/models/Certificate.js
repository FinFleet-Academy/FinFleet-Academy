import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  credentialId: { type: String },
  fileUrl: { type: String, required: true },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  metadata: {
    score: Number,
    duration: String,
    skills: [String]
  }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
