import mongoose from 'mongoose';

const helpTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  screenshotUrl: { type: String, default: '' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
}, { timestamps: true });

export default mongoose.model('HelpTicket', helpTicketSchema);
