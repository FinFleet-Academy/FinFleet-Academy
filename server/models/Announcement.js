import mongoose from 'mongoose';

const announcementCommentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [announcementCommentSchema],
  isPinned: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
