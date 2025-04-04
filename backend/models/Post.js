// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {  type: String, required: true  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  images: [{ type: String }],
  category: { type: String, enum: ['announcement', 'event', 'blog', 'update'] },
  reported: { type: Boolean, default: false }
}, { timestamps: true});

module.exports = mongoose.model('Post', postSchema);
