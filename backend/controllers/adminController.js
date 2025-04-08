// controllers/adminController.js
const Post = require("../models/Post");

// Fetch all flagged posts (those that have been reported)
const getFlaggedPosts = async (req, res) => {
  try {
    // Retrieve posts with reported flag set to true, sorted by newest first
    const posts = await Post.find({ reported: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve a flagged post by clearing its reported flag
const approvePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Set reported flag to false to mark the post as approved
    post.reported = false;
    await post.save();
    res.status(200).json({ message: "Post approved successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a flagged post completely
const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFlaggedPosts, approvePost, deletePost };
