import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'FREE' },
  isAdmin: { type: Boolean, default: false, index: true },
  mobile: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 300 },
  profileImage: { type: String, default: '' },
  chatCount: { type: Number, default: 0 },
  lastChatReset: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: 0 },
  virtualBalance: { type: Number, default: 100000 },
  points: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: String, default: null },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Privacy Settings — enforced at API level
  privacy: {
    email:        { type: String, enum: ['public', 'followers', 'private'], default: 'private' },
    mobile:       { type: String, enum: ['public', 'followers', 'private'], default: 'private' },
    bio:          { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
    followersList:{ type: String, enum: ['public', 'private'], default: 'public' },
    followingList:{ type: String, enum: ['public', 'private'], default: 'public' },
    certificates: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
  },
  // Certificates earned from courses
  certificates: [{
    courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseName:  { type: String },
    completedAt: { type: Date, default: Date.now },
    badge:       { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
    isVisible:   { type: Boolean, default: true },
  }],
  refreshTokens: [String],
}, { timestamps: true });

userSchema.index({ plan: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ email: 1 }); // Ensuring email index explicitly

export default mongoose.model('User', userSchema);
