import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveClass',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: { type: String }, // Razorpay/Stripe Payment ID
  orderId: { type: String },   // Razorpay/Stripe Order ID
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  attendanceStatus: {
    type: String,
    enum: ['absent', 'present'],
    default: 'absent'
  }
}, { timestamps: true });

// Ensure a user can only enroll once per class
EnrollmentSchema.index({ user: 1, class: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema);
