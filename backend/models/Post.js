// models/Post.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  images: [{ type: String }],
  likes: [{ type: String }],
  comments: [{
    username: { type: String, required: true },
    content: { type: String, required: true },
  }],
  reported: { type: Boolean, default: false },
  announcement: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);