import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    hasImage: { type: Boolean, default: false },
    // imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatPicture', required: false },
    imageUrl: { type: String, required: false },
    placeholderImgId: { type: mongoose.Schema.Types.ObjectId, required: false },
    placeholderUrl: { type: String, required: false },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.Model.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
