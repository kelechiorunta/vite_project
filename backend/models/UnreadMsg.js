// models/UnreadMsg.js
import mongoose, { Schema } from 'mongoose';

const unreadMsgSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true // Who receives the messages
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true // Who sent them
    },
    count: {
      type: Number,
      default: 0
    },
    lastMessage: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.UnreadMsg || mongoose.model('UnreadMsg', unreadMsgSchema);
