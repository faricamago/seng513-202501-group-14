// routes/post.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Retrieve all posts
router.get('/', postController.getPosts);

// Create a new post
router.post('/', postController.createPost);

module.exports = router;
