// models/Post.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
  username: { type: String, required: true },
  content:  { type: String, required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

const postSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [{ type: String }],
  images: [{ type: String }],
  likes: [{ type: String }],
  comments: [{
    commentSchema
  }],
  reported: { type: Boolean, default: false },
  announcement: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);