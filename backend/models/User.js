// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('User', userSchema);
