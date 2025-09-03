import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
    isGroup: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
