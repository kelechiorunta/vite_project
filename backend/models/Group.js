// models/Group.js
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // logo: { type: String, required: false },
  logo: { type: mongoose.Schema.Types.ObjectId, required: false },
  description: { type: String, required: false },
  placeholderString: { type: String, required: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
