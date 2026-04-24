import mongoose from 'mongoose';

const LiveClassSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // duration in minutes
  platform: { 
    type: String, 
    enum: ['google_meet', 'zoom'], 
    default: 'google_meet' 
  },
  classType: { 
    type: String, 
    enum: ['free', 'paid'], 
    default: 'free' 
  },
  price: { type: Number, default: 0 },
  meetingId: { type: String }, // For Zoom/Google Meet API internal use
  meetingLink: { type: String, required: true }, // The secure link
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  thumbnail: { type: String },
  recordingUrl: { type: String },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

export default mongoose.model('LiveClass', LiveClassSchema);
