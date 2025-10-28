// // models/Group.js
// import mongoose from 'mongoose';

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   username: { type: String, required: false },
//   picture: { type: String, required: false },
//   // logo: { type: String, required: false },
//   logo: { type: mongoose.Schema.Types.ObjectId, required: false },
//   description: { type: String, required: false },
//   placeholderString: { type: String, required: false },
//   members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

// export default Group;

// models/Group.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  url: String, // URL or GridFS reference
  placeholderUrl: String // optional low-res placeholder
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  picture: { type: String },
  description: { type: String },
  placeholderString: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  logo: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }, // optional link to file
  hasFile: { type: Boolean, default: false },
  file: fileSchema, // embedded file object
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
