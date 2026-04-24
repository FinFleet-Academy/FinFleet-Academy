import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  plan: { type: String, default: 'FREE' },
  isAdmin: { type: Boolean, default: false },
  mobile: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 300 },
  profileImage: { type: String, default: '' },
  chatCount: { type: Number, default: 0 },
  virtualBalance: { type: Number, default: 100000 },
  points: { type: Number, default: 0 },
  privacy: {
    email:        { type: String, enum: ['public', 'followers', 'private'], default: 'private' },
    mobile:       { type: String, enum: ['public', 'followers', 'private'], default: 'private' },
    bio:          { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
  },
  certificates: [{
    courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseName:  { type: String },
    completedAt: { type: Date, default: Date.now },
    badge:       { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
  }],
}, { timestamps: true });

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
