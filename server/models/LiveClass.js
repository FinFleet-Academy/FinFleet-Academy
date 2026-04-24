import mongoose from 'mongoose';

const LiveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: String, // e.g., "60 mins"
    default: "60 mins"
  },
  meetLink: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  },
  recordingUrl: {
    type: String,
    trim: true
  },
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.model('LiveClass', LiveClassSchema);
