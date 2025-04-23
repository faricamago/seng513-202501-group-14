// controllers/commentController.js

import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';


export const addComment = async (req, res) => {
  try {
    const { username, content } = req.body;
    const { id: postId } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Author not found' });

    const newComment = {
      _id:       new mongoose.Types.ObjectId(),
      username,
      photo:     user.photo,
      content
    };

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );

    return res.status(201).json({ message: 'Comment added', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { username, content } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: postId, 'comments._id': commentId, 'comments.username': username },
      {
        $set: {
          'comments.$.content':   content,
          'comments.$.updatedAt': new Date()
        }
      },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: 'Comment not found or not authorised' });
    res.json({ message: 'Comment updated', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { username } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId, username } } },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: 'Comment not found or not authorised' });
    res.json({ message: 'Comment deleted', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
