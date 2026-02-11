import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRead: { type: Boolean, default: false },
  text: { type: String, required: true },
}, { timestamps: true }); // هاد السطر بيضيف وقت الإرسال تلقائياً

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);