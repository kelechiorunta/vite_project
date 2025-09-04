import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

const ChatMessage = mongoose.Model.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
