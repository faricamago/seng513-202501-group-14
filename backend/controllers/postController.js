// controllers/postController.js
const path = require('path');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content, username } = req.body;
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      // Convert each file's path to a relative path.
      // Assuming your uploads folder is in your project root,
      // you can use path.relative() to get the relative path.
      imagePaths = req.files.map(file => {
        // Compute the relative path from your project root (process.cwd())
        const relativePath = path.relative(process.cwd(), file.path);
        return relativePath;
      });
    }

    // Construct the post data including title and an array of image paths
    const postData = { title, content, username, images: imagePaths };

    // Save the post document to MongoDB
    const post = await Post.create(postData);

    res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('username', 'name email');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const togglePostLike = async (req, res) => {

  console.log("togglePostLike called with body:", req.body);

  try {
    const { _id, loggedInUsername } = req.body;
    const post = await Post.findById(_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user already liked the post
    const alreadyLiked = post.likes.includes(loggedInUsername);
    if (alreadyLiked) {
      // Remove the user from the likes array
      post.likes = post.likes.filter(user => user !== loggedInUsername);
    } else {
      // Add the user to the likes array
      post.likes.push(loggedInUsername);
    }

    // Save the updated post
    await post.save();

    res.status(200).json({
      message: 'Post like status updated successfully',
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  togglePostLike
};
