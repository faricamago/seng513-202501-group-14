import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// get comment
router.get("/", async (req, res) => {
  const { postId } = req.query;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post.comments || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post comment
router.post("/", async (req, res) => {
  const { postId, username, content } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = { username, content, createdAt: new Date() };
    post.comments.push(comment);
    await post.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete comment
router.delete("/:postId/:commentIndex", async (req, res) => {
  const { postId, commentIndex } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const index = parseInt(commentIndex, 10);
    if (isNaN(index) || index < 0 || index >= post.comments.length) {
      return res.status(400).json({ error: "Invalid comment index" });
    }

    post.comments.splice(index, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
