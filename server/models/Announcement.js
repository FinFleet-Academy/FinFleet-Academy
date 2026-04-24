import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPinned: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
