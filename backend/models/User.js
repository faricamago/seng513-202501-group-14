// models/User.js

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';  // Import bcrypt

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;  // You can adjust this value

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  followers: [{ type: String }], // list of usernames following this user
  following: [{ type: String }]  // list of usernames this user is following
}, { timestamps: true });

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt with a given factor
    const salt = await bcryptjs.genSalt(SALT_WORK_FACTOR);
    // Hash the password using the salt
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('User', userSchema);
