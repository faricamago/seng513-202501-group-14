// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
