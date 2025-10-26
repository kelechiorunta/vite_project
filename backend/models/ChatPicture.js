import mongoose from 'mongoose';

const chatPictureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId, // GridFS file _id
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  pictureUrl: {
    type: String, // optional streaming endpoint, e.g. /api/chat-pictures/:id
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-populate sender/receiver/message info
chatPictureSchema.pre(/^find/, function (next) {
  this.populate('senderId', 'username picture')
    .populate('receiverId', 'username picture')
    .populate('messageId', 'content createdAt');
  next();
});

const ChatPicture = mongoose.models.ChatPicture || mongoose.model('ChatPicture', chatPictureSchema);

export default ChatPicture;
