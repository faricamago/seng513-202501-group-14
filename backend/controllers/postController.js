// controllers/postController.js
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content, username } = req.body;
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => {
        const relativePath = path.relative(process.cwd(), file.path);
        return relativePath;
      });
    }

    const postData = { title, content, username, images: imagePaths };

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
    // Only fetch posts that are not reported:
    const posts = await Post.find({ reported: false }).populate('username', 'name email');
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

    const alreadyLiked = post.likes.includes(loggedInUsername);
    if (alreadyLiked) {
      post.likes = post.likes.filter(user => user !== loggedInUsername);
    } else {
      post.likes.push(loggedInUsername);
    }

    await post.save();

    res.status(200).json({
      message: 'Post like status updated successfully',
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, keptImages } = req.body;
    let keptImagesArray = [];
    if (keptImages) {
      try {
        keptImagesArray = JSON.parse(keptImages);
      } catch (e) {
        keptImagesArray = [];
      }
    }
    let newImagePaths = [];
    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map(file => {
        const relativePath = path.relative(process.cwd(), file.path);
        return relativePath;
      });
    }

    // Helper function to normalize paths (convert backslashes to forward slashes)
    const normalizePath = (p) => p.replace(/\\/g, '/');

    // Retrieve the original post from the database
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Normalize both the original image paths and the keptImages array.
    const normalizedOriginal = originalPost.images.map(normalizePath);
    const normalizedKept = keptImagesArray.map(normalizePath);

    // Determine which images were removed by the user
    const removedImages = normalizedOriginal.filter(imgPath => !normalizedKept.includes(imgPath));

    // Delete only the removed images from the uploads folder.
    removedImages.forEach(imagePath => {
      const absolutePath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    });

    // Combine the kept images and any new image paths.
    const combinedImages = [...keptImagesArray, ...newImagePaths];

    // Update the post record with the new data.
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, images: combinedImages },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete post and associated images from uploads folder
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.images && post.images.length > 0) {
      post.images.forEach(imagePath => {
        const absolutePath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reportPost = async (req, res) => {
  try {
    const { postId, reportedBy } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Mark the post as reported
    post.reported = true;
    
    await post.save();

    res.status(200).json({
      message: "Post reported successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  togglePostLike,
  updatePost,  // New update endpoint
  deletePost,   // New delete endpoint,
  reportPost
};
