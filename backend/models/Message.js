import mongoose from 'mongoose';
import User from './User.js';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true }, // user ID or username
  receiver: { type: String, required: false }, // user ID or username
  groupId: { type: String, required: false }, // group ID (for group chat)
  senderName: { type: String, required: false },
  receiverName: { type: String, required: false },
  senderAvatar: { type: String, required: false },
  receiverAvatar: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  hasImage: { type: Boolean, required: false },
  imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatPicture', required: false },
  placeholderImgId: { type: mongoose.Schema.Types.ObjectId, required: false },
  imageUrl: { type: String, required: false },
  placeholderUrl: { type: String, required: false }
});

messageSchema.pre('save', async function (next) {
  try {
    // Only run if sender or receiver are still in ID format
    if (mongoose.Types.ObjectId.isValid(this.sender)) {
      const senderUser = await User.findById(this.sender);
      if (senderUser) {
        this.senderName = senderUser.username;
        this.senderAvatar = senderUser.picture;
      }
    }

    if (mongoose.Types.ObjectId.isValid(this.receiver)) {
      const receiverUser = await User.findById(this.receiver);
      if (receiverUser) {
        this.receiverName = receiverUser.username;
        this.receiverAvatar = receiverUser.picture;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});
// export const Message = mongoose.model('Message', messageSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
