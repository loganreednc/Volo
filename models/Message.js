// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // e.g., "admin" or candidate ID
  receiver: { type: String, required: true }, // e.g., candidate ID or "admin"
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
