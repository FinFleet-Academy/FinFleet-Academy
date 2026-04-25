import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'FREE' },
  isAdmin: { type: Boolean, default: false, index: true },
  mobile: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 500 },
  profileImage: { type: String, default: '' },
  socialLinks: {
    instagram: { url: { type: String, default: '' }, visibility: { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' } },
    twitter:   { url: { type: String, default: '' }, visibility: { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' } },
    linkedin:  { url: { type: String, default: '' }, visibility: { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' } },
    website:   { url: { type: String, default: '' }, visibility: { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' } }
  },
  stats: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    certificates: { type: Number, default: 0 }
  },
  // Global Privacy Toggles
  privacy: {
    email:        { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PRIVATE' },
    mobile:       { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PRIVATE' },
    stats:        { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' },
    certificates: { type: String, enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'], default: 'PUBLIC' },
  },
  themePreference: { type: String, enum: ['light', 'dark'], default: 'dark' },
  refreshTokens: [String],
}, { timestamps: true });

userSchema.index({ plan: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ email: 1 }); // Ensuring email index explicitly

export default mongoose.model('User', userSchema);
