import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  preferences: [{ type: String, enum: ['MARKETS', 'CRYPTO', 'EDUCATION', 'UPDATES'] }],
  isSubscribed: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
