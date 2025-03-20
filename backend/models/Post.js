// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  images: [{ type: String }],
  category: { type: String, enum: ['announcement', 'event', 'blog', 'update'] },
  reported: { type: Boolean, default: false }
}, { timestamps: true,collection: 'Post' });

module.exports = mongoose.model('Post', postSchema);
