// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  images: [{ type: String }],
  likes: [{ type: String }],
  comments: [{
    username: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
  }],
  reported: { type: Boolean, default: false },
  official: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
