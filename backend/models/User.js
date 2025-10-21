import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

// const unreadSchema = new mongoose.Schema({
//     count: { type: Number, default: 0 },
//     lastMessage: { type: String, default: '' }
//   }, { _id: false }); // Disable _id for subdocs inside Map

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, default: '' },
  name: { type: String, required: false, default: '' },
  email: { type: String, required: false, validate: validator.isEmail },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  picture: { type: String, required: false, default: '' },
  lastMessage: { type: String, required: false, default: '' },
  lastMessageCount: { type: Number, required: false, default: 0 },
  isOnline: { type: Boolean, required: false, default: null },
  unread: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UnreadMsg', required: false }],
  token: { type: String, required: false },
  birthday: { type: String, required: false },
  phone: { type: String, required: false },
  gender: { type: String, required: false },
  address: { type: String, required: false },
  otp: {
    type: String,
    default: 'otp',
    required: false
    // required: true,
  },
  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 300 * 1000), // Set to 5 minutes from now
    required: false
  },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  google: {
    name: { type: String, required: false },
    email: { type: String, required: false, validate: validator.isEmail },
    accessToken: { type: String, required: false },
    active: { type: Boolean, required: false }
  }
  // Example schema update
  // unreadCounts: {
  //     type: Map,
  //     of: unreadSchema,
  //     default: () => new Map()
  //   },
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if entered password matches the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Ensure unique email index
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
