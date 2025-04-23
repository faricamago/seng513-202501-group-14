// controllers/adminController.js

import Post from "../models/Post.js";
import Notification from '../models/Notification.js';


export const getFlaggedPosts = async (req, res) => {
  try {
   
    const posts = await Post.find({ reported: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const approvePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
   
    post.reported = false;
    await post.save();

    await Notification.create({
      user: post.username,
      postId: post._id,
      postTitle: post.title,
      type: 'approved',
      message: `Your post "${post.title}" has been approved by admin.`
    });

    res.status(200).json({ message: "Post approved successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePost = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

 
  await Notification.create({
    user: post.username,
    postId: post._id,
    postTitle: post.title,
    type: 'deleted',
    message: `Your post "${post.title}" was deleted by admin.`,
  });

  await Post.findByIdAndDelete(postId);
  res.status(200).json({ message: "Post deleted successfully" });
};
