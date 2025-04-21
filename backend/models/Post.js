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
    // author
    username: { type: String, required: true },
    photo:    { type: String },             

    // body
    content:  { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
      }],
  reported: { type: Boolean, default: false },
  announcement: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);