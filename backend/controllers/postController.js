// controllers/postController.js

import Post from "../models/Post.js";
import Notification from '../models/Notification.js';
import { uploadImage } from  './upload.js'
import { getStoragePathFromUrl, deleteFileFromFirebase } from "../firebaseStorageHelper.js";

const createPost = async (req, res) => {
  try {
    const { title, content, username } = req.body;
    let imageUrls = [];

    
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const url = await uploadImage(file);
        return url;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    
    const postData = { title, content, username, images: imageUrls };

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
    
    let filter = { reported: false };
   
    const searchQuery = req.query.query;
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    const posts = await Post.find(filter).populate('username', 'name email');
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

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const url = await uploadImage(file);
        return url;
      });
      newImageUrls = await Promise.all(uploadPromises);
    }

    
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    
    const removedImages = originalPost.images.filter((imgUrl) => !keptImagesArray.includes(imgUrl));

    for (const url of removedImages) {
      const storagePath = getStoragePathFromUrl(url);
      await deleteFileFromFirebase(storagePath);
    }

   
    const combinedImages = [...keptImagesArray, ...newImageUrls];

    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, images: combinedImages },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    
    if (post.images && post.images.length > 0) {
      for (const url of post.images) {
        const storagePath = getStoragePathFromUrl(url);
        await deleteFileFromFirebase(storagePath);
      }
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

    
    post.reported = true;
    
    await post.save();

   
    await Notification.create({
      user: post.username,
      postId: post._id,
      postTitle: post.title,
      type: 'reported',
      message: `Your post "${post.title}" has been reported and is under review by admin.`
    });

    res.status(200).json({
      message: "Post reported successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export  {
  getPosts,
  createPost,
  togglePostLike,
  updatePost,
  deletePost,
  reportPost
};
